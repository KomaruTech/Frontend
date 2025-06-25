import './App.css'
import {Calendar} from "@heroui/react";
import {parseDate} from "@internationalized/date";

function App() {

  return (
    <>
    <div className="flex gap-x-4">
      <Calendar aria-label="Date (No Selection)" />
    </div>
      
    </>
  )
}

export default App
