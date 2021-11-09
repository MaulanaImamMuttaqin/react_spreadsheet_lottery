import React, { useState } from 'react'
import * as XLSX from "xlsx";

function App() {
  const [file, setFile] = useState("");
  const [data, setData] = useState([]);

  const filePathSet = e => {
    e.stopPropagation();
    e.preventDefault();
    let inputFile = e.target.files[0];
    console.log(inputFile);
    setFile(inputFile);

    console.log(file);
  }

  const readFile = e => {
    let f = file;
    let name = f.name;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      convertToJson(data)
    };
    reader.readAsBinaryString(f);
  }

  const convertToJson = csv => {
    var lines = csv.split("\n");
    var result = [];
    var headers = lines[0].split(",");
    for (var i = 1; i < lines.length; i++) {
      var obj = {};
      var currentline = lines[i].split(",");
      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }
    setData(result);
    console.log(data)
  }

  return (
    <div className="center border border-black h-screen flex-col">
      <input
        className=""
        type="file"
        id="file"
        onChange={(e) => filePathSet(e)}
      />
      <button
        className="bg-blue-300 text-white font-bold px-7 py-3 rounded-xl m-3"
        onClick={() => readFile()}
      >
        Read File
      </button>
    </div>
  )
}

export default App
