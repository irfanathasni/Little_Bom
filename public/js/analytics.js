const months =['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec']
const labels = monthlySales.map(d => months[d._id.month -1])
const revenue = monthlySales.map(d => d.revenue)
const orders = monthlySales.map(d =>d.orders)
const dailyLabels = dailySales.map(d => `${d._id.day}/${d._id.month}`)
const dailyRevenue = dailySales.map(d => d.revenue)
const weeklyLabels = weeklySales.map(d =>`week ${d._id.week}`)
const weeklyRevenue = weeklySales.map(d =>d.revenue)

new Chart(document.getElementById('barChart'),{
    type :'bar',
    data : {
        labels,
        datasets :[{ label: 'Revenue (₹)',data:revenue,backgroundColor:'#2471a3'}]
    }
})

new Chart(document.getElementById('lineChart'),{
    type :'line',
    data :{
        labels,
        datasets:[{label :'Orders',data:orders,borderColor :'#1e8449',tension:0.4,fill:false}]
    }
})

new Chart(document.getElementById('pieChart'),{
    type:'pie',
    data:{
        labels:statusData.map(d => d._id),
        datasets : [{data:statusData.map(d => d.count),
        backgroundColor : ['#2471a3','#d4ac0d','#1e8449','#1a5276','#c0392b','#7d3c98']
        }]
    }
})

new Chart(document.getElementById('dailyChart'),{
    type: 'bar',
    data:{
        labels:dailyLabels,
        datasets:[{
            label:'Daily revenue($)',
            data:dailyRevenue,
            backgroundColor:'#d35400'
        }]
    },
    options:{
        resposive :true,
        plugins:{legend:{display:false}}
    }
})
new Chart(document.getElementById('weeklyChart'),{
    type:'line',
    data:{
        labels:weeklyLabels,
        datasets:[{
            label:'weekly Revenue(₹)',
            data:weeklyRevenue,
            borderColor:'#7d3c98',
            tension:0.4,
            fill:false
        }]
    },
    options:{
        responsive:true,
        plugins:{legend:{display:false}}
    }
})
