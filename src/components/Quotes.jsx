import { use, useEffect, useState } from "react";

function Quotes() {
    const url = "https://dummyjson.com/quotes"

    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true)
    const getdata = () => {
        return fetch(url)
            .then((res) => res.json())
            .then(console.log);
    }
    useEffect(() => {
        getdata()
    }, [])


    return (
        <>
            <h2>Frases listadas</h2>
        </>
    )
}

export default Quotes;