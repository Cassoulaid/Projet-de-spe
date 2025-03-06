async function getData(){
    try {
        const response = await fetch("http://localhost:5000")
    const data = await response.json();
    console.log(data)
    } catch (error) {
        console.error(error)
    }

}

getData();