import React, { useState } from 'react'
import * as XLSX from "xlsx";
import CloudUpload from './components/icons/CloudUpload';


function App() {
  const [winner, setWinner] = useState("");
  const [loading, setLoading] = useState(false)
  const [states, setStates] = useState({
    fileInfo: {},
    data: []
  });

  const filePathSet = e => {

    e.stopPropagation();
    e.preventDefault();
    let inputFile = e.target.files[0];

    readFile(inputFile)

  }

  const readFile = uploaded => {
    let fileInfo = {
      name: uploaded.name,
      size: uploaded.size,
      type: uploaded.type
    }
    let f = uploaded;
    let result = []
    const reader = new FileReader();
    reader.onload = (evt) => {
      console.log(evt)
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      result = convertToJson(data)
      setStates({ fileInfo, data: result });
    };
    reader.readAsBinaryString(f);

  }

  const convertToJson = csv => {
    let lines = csv.split("\n");
    let result = [];
    let headers = lines[0].split(",");
    for (let i = 1; i < lines.length; i++) {
      let obj = {};
      let currentline = lines[i].split(",");
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }

    return result

  }

  const pickWinner = () => {
    let data = states.data;
    let randomInt = Math.floor(Math.random() * data.length)

    setWinner(data[randomInt]["First Name"] + " " + data[randomInt]["Last Name"])

  }

  return (
    <div className="center border border-black h-screen flex-col">
      <label
        htmlFor="file"
        className="border-2 border-gray-300 px-10 py-8 rounded-2xl"
      >
        <CloudUpload />
      </label>

      <p>{states.fileInfo.name && `Imported: ${states.fileInfo.name}`}</p>

      <input
        className="overflow-hidden w-0 h-0"
        type="file"
        id="file"
        onChange={(e) => filePathSet(e)}
      />

      <button
        className="bg-blue-300 text-white font-bold px-7 py-3 rounded-xl m-3"
        onClick={() => pickWinner()}
      >
        Pilih Pemenang
      </button>

      {winner !== "" &&
        <div className="text-center">
          <p>the winner is</p>
          <p className="text-5xl font-semibold  mt-2">{winner}</p>
        </div>}
    </div>
  )
}



export default App
