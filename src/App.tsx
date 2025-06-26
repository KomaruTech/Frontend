import './App.css'
// import Search from "./layout/table_events/search";
import WeeklyEvents from "./layout/table_events/events";
import Header from './layout/header/header';
import CustomCalendar from './layout/calendary/calendary';



function App() {

  return (
    <>
    <Header />
    
    <section className="px-28 pt-[60px]">
        <h1 className="text-[56px] text-[rgb(0,78,158)] font-wadik">
          ИЮНЬ
        </h1>
      </section>

    <div className="w-full flex justify-center pt-10 bg-white">
      <div className="flex gap-6 w-full max-w-[1280px] px-6 items-start">
        {/* Календарь */}
        <div className="flex-1">
          <CustomCalendar />
        </div>

        {/* Правая панель */}
        <div className="w-[370px] self-stretch -mt-[100px]">
          <WeeklyEvents />
        </div>
      </div>
    </div>
    
    {/* <div><Search /></div> */}

    
    
      
    </>
  )
}

export default App
