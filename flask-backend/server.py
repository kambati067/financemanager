from flask import Flask
from flask import request
from flask import Response
from flask import jsonify
import plaid
from plaid.api import plaid_api
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.transactions_sync_request import TransactionsSyncRequest
from plaid.model.transactions_get_request import TransactionsGetRequest
from plaid.model.transactions_get_request_options import TransactionsGetRequestOptions
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
import pymongo
import os
import datetime
from datetime import time
from datetime import date
from dotenv import load_dotenv
from bson import ObjectId
from bson.json_util import dumps, loads
import jsonpickle
from decimal import Decimal
from werkzeug.wrappers import response
from calendar import monthrange
load_dotenv()

api = Flask(__name__)

connection = "mongodb+srv://shambutennis:ketanreddy@cluster0.fazhlr8.mongodb.net/?retryWrites=true&w=majority"

db_client = pymongo.MongoClient(connection)
db = db_client["MiniMint"]
user_collection = db["user_data"]
transaction_collection = db["transactions"]
account_collection = db["accounts"]
client_id = os.getenv('PLAID_CLIENT_ID')
secret = os.getenv('PLAID_SANDBOX_SECRET')
configuration = plaid.Configuration(
    host=plaid.Environment.Sandbox,
    api_key={
        'clientId': client_id,
        'secret': secret,
    }
)

api_client = plaid.ApiClient(configuration)
plaid_client = plaid_api.PlaidApi(api_client)

@api.route('/login', methods=['POST'])
def login():
    email = request.json['email']
    password = request.json['password']
    id = user_collection.insert_one({
        "email": email,
        "password": password,
        "items":[],
        "Food/Drinks": 0,
        "Recreation": 0,
        "Service/Utility": 0,
        "Shopping": 0,
        "Travel": 0,
        "Other": 0,
    })
    return str(id)
@api.route('/signin',methods=['POST'])
def signin():
    email = request.json['email']
    password = request.json['password']
    doc = user_collection.find_one({
        "email": email,
        "password":password
    })
    if doc:
        return jsonify(
            uid = str(doc.get('_id'))
        ),200
    else:
        return "Failed",400
@api.route("/create_link_token", methods=['POST'])
def create_link_token():
    print(client_id)
    print(secret)
    # Get the client_user_id by searching for the current user
    client_user_id = request.json["id"]
    # Create a link_token for the given user
    link_request = LinkTokenCreateRequest(
            products=[Products("transactions")],
            client_name="Plaid Test App",
            country_codes=[CountryCode('US')],
            #redirect_uri='http://localhost:3000/link',
            language='en',
           # webhook='https://webhook.example.com',
            user=LinkTokenCreateRequestUser(
                client_user_id=client_user_id
            )
        )
    response = plaid_client.link_token_create(link_request)
    # Send the data to the client
    return response.to_dict()
@api.route('/exchange_public_token', methods=['POST'])
def exchange_token():
    uid = request.json['id']
    metadata = request.json['metadata']
    institution_name = metadata['institution']['name']
    accounts = metadata['accounts']
    exchange_request = ItemPublicTokenExchangeRequest(
        public_token=request.json['public_token']
    )
    exchange_response = plaid_client.item_public_token_exchange(exchange_request)
    item_id = exchange_response['item_id']
    access_token = exchange_response['access_token']
    user_collection.update_one({
        "_id": ObjectId(uid)
    },{
        "$push":{
            "items":{
                "item_id": item_id,
                "access_token":access_token,
                "cursor": ''
            }
        }
    })
    for acc in accounts:
        account_collection.insert_one({
            "uid": ObjectId(uid),
            "item_id": item_id,
            "institution_name": institution_name,
            "account_id": acc['id'],
            "account_name":acc['name'],
            "account_mask": acc['mask']

        })
    return exchange_response.to_dict()

@api.route('/get_accounts', methods=['POST'])
def get_accounts():
    uid = request.json['id']
    res = account_collection.find({
        "uid": ObjectId(uid)
    })
    list_cur = list(res)
    return dumps(list_cur)

@api.route('/transaction_sync', methods=['POST'])
def transaction_sync():
    uid = request.json['id']
    item_id = request.json['item_id']
    transaction_request = TransactionsSyncRequest(
        access_token=request.json['access_token'],
    )
    response = plaid_client.transactions_sync(transaction_request)
    transactions = response['added']
    print(response)

# the transactions in the response are paginated, so make multiple calls while incrementing the cursor to
# retrieve all transactions
    while (response['has_more']):
        transaction_request = TransactionsSyncRequest(
            access_token=request.json['access_token'],
            cursor=response['next_cursor']
        )
        response = plaid_client.transactions_sync(transaction_request)
        print(response)
        transactions += response['added']
    for trans in transactions:
        transaction_collection.insert_one({
            "uid": ObjectId(uid),
            "item_id": item_id,
            "transaction_id": trans['transaction_id'],
            "transaction_name": trans['name'],
            "transaction_amount":trans['amount'],
            "transaction_data": trans['date'].strftime('%m/%d/%Y'),
            "transaction_category": trans['category'],
        })
    print(len(transactions))
    return str(len(transactions))

@api.route('/get_all_transactions',methods=['POST'])
def get_all_transactions():
    uid = request.json['id']
    res = transaction_collection.find({
        "uid": ObjectId(uid)
    })
    trans_list = list(res)
    return dumps(trans_list)

@api.route('/transactions/get', methods=['POST'])
def legacy_get_transactions():
    month = request.json['month']
    year = request.json['year']
    uid = request.json['id']
    days = monthrange(year,month)[1]
    items = user_collection.find_one({
        "_id": ObjectId(uid)
    })
    #print(items)
    all_transactions = []
    for item in items["items"]:
        trans_request = TransactionsGetRequest(
            access_token=item["access_token"],
            start_date=date(year,month,1),
            end_date=date(year,month,days),
            options=TransactionsGetRequestOptions()
        )   
        response = plaid_client.transactions_get(trans_request)
        transactions = response['transactions']
       #all_transactions= response['transactions']
        # Manipulate the count and offset parameters to paginate
        # transactions and retrieve all available data
        while len(transactions) < response['total_transactions']:
            trans_request = TransactionsGetRequest(
                access_token=item["access_token"],
                start_date=date(year,month,1),
                end_date=date(year,month,31),
                options=TransactionsGetRequestOptions(
                    offset=len(transactions)
                )
            )
            response = plaid_client.transactions_get(trans_request)
            transactions.extend(response['transactions'])
        all_transactions.extend(transactions)
        transactions.clear()
    #print(len(all_transactions))
    trans = []
    all_transactions.sort(key= lambda r: r.date, reverse=True)
    category_sum = {"Food/Drinks":0, "Recreation":0, "Shopping":0, "Service/Utility": 0, "Other":0,"Travel":0}
    for t in all_transactions:
        trans_dict = t.to_dict()
        d = trans_dict["date"]
        trans_dict["date"] = d.strftime("%m-%d-%Y")

        doc = account_collection.find_one({
            "uid": ObjectId(uid),
            "account_id":trans_dict["account_id"]
        })
        trans_dict["account_name"] = (doc["institution_name"].upper().ljust(10)+": •••• "+doc["account_mask"])
        category_id = trans_dict['category_id']
        amount = Decimal(trans_dict['amount']).quantize(Decimal('0.01'))
        trans_dict["amount"] = amount
        if amount<0:
            trans_dict["color"]="green"
            trans_dict["amount_str"] = "+ $",amount*-1
        else:
            trans_dict["color"]="red"
            trans_dict["amount_str"] = "- $",amount
        print(amount)
        if category_id[0:2]=="13":
            if amount>0:
                category_sum["Food/Drinks"] = category_sum.get("Food/Drinks",0)+amount
            trans_dict["my_category"]="Food/Drinks"
        elif category_id[0:2]=="17":
            if amount>0:
                category_sum["Recreation"] = category_sum.get("Recreation",0)+amount
            trans_dict["my_category"]="Recreation"
        elif category_id[0:2]=="19":
            if amount>0:
                category_sum["Shopping"] = category_sum.get("Shopping",0)+amount
            trans_dict["my_category"]="Shopping"
        elif category_id[0:2]=="18" or category_id[0:2]=="14":
            if amount>0:
                category_sum["Service/Utility"] = category_sum.get("Service/Utility",0)+amount
            trans_dict["my_category"]="Service/Utility"
        elif category_id[0:2]=="22":
            if amount>0:
                category_sum["Travel"] = category_sum.get("Travel",0)+amount
            trans_dict["my_category"]="Travel"
        else:
            if amount>0 and category_id[0:2]!="16" and category_id[0:2]!="21":
                category_sum["Other"] = category_sum.get("Other",0)+amount
            trans_dict["my_category"]="Other"
        trans.append(trans_dict)
    overBudget = False
    if(items["Food/Drinks"]<category_sum["Food/Drinks"] or items["Recreation"]<category_sum["Recreation"] or items["Shopping"]<category_sum["Shopping"] or 
    items["Service/Utility"]<category_sum["Service/Utility"] or items["Travel"]<category_sum["Travel"] or 
    items["Other"]<category_sum["Other"]):
        overBudget = True
    return {"transactions":trans,"categories": category_sum,"overBudget": overBudget}
@api.route('/get_categories',methods=['GET'])
def get_categories():
    response = plaid_client.categories_get({})
    categories = response['categories']
    ans = []
    for c in categories:
        ans.append(c.to_dict())
    #Food Drink (13), Healthcare (14), Payment(16), Recreation(17), Services(18), Personal Care Services(18045)
    #Shops(19), Tax(20), Transfer(21), Travel(22)
    return ans
@api.route("/set_budget", methods=['POST'])
def set_budget():
    food = request.json['food']
    shopping = request.json['shopping']
    entertainment = request.json['recreation']
    utilities = request.json['utilities']
    other = request.json['other']
    travel = request.json['travel']
    uid = request.json['id']
    user_collection.update_one({
        "_id": ObjectId(uid)
    },{
        "$set":{
            "Food/Drinks":food,
            "Recreation": entertainment,
            "Service/Utility": utilities,
            "Shopping": shopping,
            "Travel": travel,
            "Other": other
        }
    })
    return "success"


if __name__ == '__main__':
    api.run(debug=True)