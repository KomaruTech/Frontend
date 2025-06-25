import './App.css'
import {Calendar} from "@heroui/react";
import {parseDate} from "@internationalized/date";
import Search from "./layout/table_events/search";
import WeeklyEvents from "./layout/table_events/events";
import Button_events from "./layout/table_events/button_events";


function App() {

  return (
    <>
    <div className="flex gap-x-4">

    </div>
    <div>
      <Search />
    </div>
    <div>
      <WeeklyEvents />
    </div>
    <div>
      <Button_events /> 
    </div>
      
    </>
  )
}

export default App
