import axios from "axios";
import { use, useEffect, useState } from "react";


function Dashboard() {
    const url = "https://dummyjson.com/quotes"
    // HOOK
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    // Invocar el servicio (ENdpoint)
    const getquotes = async () => {
        try {
            const result = await axios.get(url)
            console.log(result.data.quotes);
            setQuotes(quotes => result.data.quotes);
            setLoading(false);
            
        }
        catch (error) {
            console.error(error);
        }

    }
     useEffect(() => {
        getquotes();
    }, []);

    return (

        <>
            <h1>Dashboard</h1>
            
            {loading ? (
            
        <p><img src="https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif" alt="Cargando"/></p>
        
         
        ) : 
            <><p>Cargando completado </p>
            {quotes.map(quote => (
                <div key={quote.id} style={{marginTop: "1.5rem", border: "2px solid aqua", color: "aqua",backgroundColor: "black", margin: "10px", padding: "10px"}}>
                    <h3>"{quote.quote}"</h3>
                    <p>- {quote.author}</p>
                </div>
            ))}

            
            
            </>
            }
            
        </>
    );
}
export default Dashboard;