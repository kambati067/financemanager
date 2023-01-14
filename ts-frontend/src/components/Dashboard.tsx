import React,{useState,useEffect} from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Colors,
    ArcElement,
  } from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
interface IPROPS{
    uid: string
    //options: ChartOptions<'doughnut'>;
    //data: ChartData<'doughnut'>;
}
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
  );

let Dashboard: React.FC<IPROPS> = ({uid}) => {
    const [month,setMonth] = useState(12)
    const [year,setYear] = useState(2022)
    const [label,setLabel] = useState<any[]>([])
    const [moneyData,setMoneyData]=useState<any[]>([])
    const[transactions,setTransactions] = useState([])
    const[categories,setCategories] = useState(new Map())
    useEffect(() =>{
        fetch('/transactions/get',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({id:uid, month:month, year: year})
        })
        .then((res) =>res.json())
        .then((data) =>{
            console.log(data["categories"])
            setTransactions(data["transactions"])
            setCategories((data["categories"]))
            for(let[key,value] of Object.entries(data["categories"])){
                setLabel(label =>[
                    ...label,key
                ])
                setMoneyData(moneyData =>[
                    ...moneyData,value
                ])
            }
        })
    },[])

    var data = {
        /*labels: Object.entries(categories).map(([key,value])=>{
            key: => ke
        }),*/
        labels: label,
        datasets:[{
            label: "",
            data: moneyData,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
              ],
              borderWidth: 1

        }]
    }
    const options = {
        plugins: {
          colors: {
            forceOverride: true
          }
        }
      };
    var pieDate = {
        labels: label,
          datasets: [{
            label: month+"/"+year,
            data: moneyData,
            backgroundColor: [
              'rgb(244, 106, 155)',
              'rgb(234, 85, 69)',
              'rgb(239, 155, 32)',
              'rgb(39, 174, 239)',
              'rgb(135, 188, 69)',
              'rgb(179, 61, 198)'
            ],
            hoverOffset: 4
          }]
    }


    const renderCategories = Object.entries(categories).map(([key,value]) =>{
        return (
            <div>
                <h1>{key}: </h1>
                <h2>${value}</h2>
            </div>
        )
    })
  return (
    <>
    <Bar data={data}></Bar>
    <Doughnut data={pieDate}></Doughnut>
    <div>
      
    </div>
    {transactions.map((trans) =>{
        return <li key={trans["transaction_id"]}>{trans['name']} {trans['amount']} {trans['date']}</li>
    })}
    {renderCategories}
    </>
  )
}

export default Dashboard
