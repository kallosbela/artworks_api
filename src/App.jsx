import { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

function App() {

  const [datas, setDatas] = useState([]);

  const [searchText, setSearchText] = useState("");

  const loadObjectIDs = async () => {
    const res = await axios.get(
      `https://collectionapi.metmuseum.org/public/collection/v1/search?isHighlight=true&hasImages=true&medium=Paintings&q=${searchText}`
    );
    
    const objectIDs = res.data.objectIDs

    let datasArr = [];
    for (const index in objectIDs) {
      const id = objectIDs[index];
      const data = await loadDatas(id);
      console.log("data.url", data.url);
      if (data.url==="") {continue}
      datasArr.push(data);
      if (datasArr.length >= 10) {
        break;
      }
    }
    setDatas(datasArr);
    console.log(datasArr);
  };

  const loadDatas = async (id) => {
    const res = await axios.get(
      `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
    );
    console.log(res.data);
    return {
      id: id,
      title: res.data.title,
      artist: res.data.artistDisplayName,
      date: res.data.objectDate,
      description: res.data.objectURL,
      url: res.data.primaryImage,
    };
  };

  return (
    datas && (
      <div className="App">
        <input
          type="text"
          placeholder="search"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
        />
        <button
          onClick={loadObjectIDs}
        >
          Search
        </button>

        {datas.map((item) => (
          <section key={item.id}>
            <h1>{item.title}</h1>
            <p>Artist: {item.artist}</p>
            <p>Date: {item.date}</p>
            <p>
              More information <a href={item.description}>here</a>
            </p>
            <img src={item.url} alt="wrong" width="500px" />
          </section>
        ))}
      </div>
    )
  );
}

export default App;
