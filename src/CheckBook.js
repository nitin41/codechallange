import React, { useEffect, useState } from 'react'
import moment from 'moment'
import './CheckBookReact.css'

const sourceData = [
  {tid:1,date:"2020-03-10T10:47:02-05:00", credit:100, description:"initial deposit"},
  {tid:2,check_no:1, date:"2020-03-10T16:50:59Z", debit:3.14, description:"gum", canceled:true},
  {tid:3,check_no:2, date:"2020-03-10T16:49:21-05:00", debit:3.14, description:"gum"},
  {tid:4,date:"2020-03-10T13:00:30-05:00", credit:1.99, description:"pocket change"},
  {tid:5,date:"2020-03-16T09:02:30-05:00", credit:420.15, description:"paycheck"},
  {tid:6,check_no:3, date:"2020-03-16T09:02:30-05:00", debit:19.15, description:"ConEd - March"},
  {tid:7,check_no:4, date:"2020-03-17T11:57:30-05:00", debit:81.45, description:"AT&T"},
  {tid:8,check_no:5, date:"2020-03-17T16:02:30-05:00", debit:29.03, description:"Ikea"},
  {tid:9,date:"2020-03-23T09:02:30-05:00", credit:420.13, description:"paycheck"},
  {tid:10,check_no:6, date:"2020-03-23T10:11:00-05:00", debit:13.57, description:"More checks"},
  {tid:11,check_no:225, date:"2020-03-24T14:20:33-05:00", debit:97.76, description:"Strand"},
  {tid:12,check_no:226, date:"2020-03-24T14:20:33-05:00", debit:513.01, description:"Fraud", canceled:true},
  {tid:13,check_no:227, date:"2020-03-26T19:00:00-05:00", debit:31.01, description:"IHOP"}
];

// formatting
const formatDefault = (x) => x.toString()

const sortDirClass = {1:'asc',2:'desc',0:null}

const cmpNoop = () => 0

// table layout
const columns = [
  {key:'date',        cmp:cmpNoop, format:formatDefault, classNames:[], label:'Date'},
  {key:'check_no',    cmp:cmpNoop, format:formatDefault, classNames:[], label:'No.',},
  {key:'debit',       cmp:cmpNoop, format:formatDefault, classNames:['currency'], label:'Debit',},
  {key:'credit',      cmp:cmpNoop, format:formatDefault, classNames:['currency'], label:'Credit',},
  {key:'balance',     cmp:cmpNoop, format:formatDefault, classNames:['currency', 'balance'], label:'Balance',},
  {key:'description', cmp:cmpNoop, format:formatDefault, classNames:[], label:'Description',},
  {key:'canceled',    cmp:cmpNoop, format:formatDefault, classNames:['canceledColumn'], label:'Canceled?',},
];

function HeaderRow({sortedField,toggleSort}) {
  console.log('sortedField',sortedField)
  return <tr>
    {columns.map( (col) =>
      <th
        key={col.key}
        className={col.key}
        onClick={()=> toggleSort(col.key,col.cmp)}
        >
          <div className={'middleAlign'}>
            {col.label}
            <i className="material-icons" style={{visibility: sortedField.key===col.key?'visible':'hidden'}}>
              {sortedField.dir===1 ? 'arrow_drop_down': 'arrow_drop_up'}
            </i>
          </div>
        </th>
    )}
  </tr>  
}


/* 
The associated style sheet will render the checkbox nicely with the following:
    <td className="canceled canceledColumn">
      <div className="checkboxWrapper">
        <div className="md-checkbox">
          <input id={`cancelCheckbox${check.tid}`} type="checkbox" checked={check.canceled}/>
          <label htmlFor={`cancelCheckbox${check.tid}`}></label>
        </div>
      </div>
    </td>
*/

// component to render the check book
export default function CheckBook() {
  const [masterData, setMasterData] = useState(sourceData)

  const setEntries = (val=0) => {
    let balance = 0
    const finalData = masterData.map((row) => {
      let debit = 0
      let credit = 0
      if(!row.check_no)
        row.check_no=0
      if(row.debit)
        debit = row.debit
      if(row.credit)
        credit=row.credit
      let bel= credit - debit 
      row.credit = credit
      row.debit = debit
      row.balance = 0
      if(row.tid === val)
        row.canceled = !row.canceled
      if(!row.canceled){
        balance += bel
        row.balance = balance.toFixed(2)
      }  
      return row
    })
    setMasterData(finalData)
  }
  
  useEffect(()=>{
    setEntries()
  },[])

  const [sortedField, setSortedField] = useState({dir:0});

  const toggleSort = (key,cmp) => {};

  const onChangeAction = (evt) => {
    const val = parseInt(evt.target.value)
    setEntries(val)
  }

  return (
    <div className={'tableWrapper'}>
      <table>
        <thead><HeaderRow sortedField={sortedField} toggleSort={toggleSort} /></thead>
        <tbody>
          {masterData.map( (row) =>
            <tr key={row.tid} className={row.canceled ? 'canceled canceledColumn':''}>
              <td>
                <div className={['middleAlign']}>
                  {moment(row.date).format('MMM DD, YYYY, HH:mm a')}
                </div>
              </td>
              <td>
                <div className={['middleAlign']}>
                  {row.check_no ? row.check_no : null}
                </div>
              </td>
              <td>
                <div className={!row.canceled? 'debit middleAlign': 'middleAlign'}>
                  {row.debit ? row.debit: null}
                </div>
              </td>
              <td>
              <div className={!row.canceled? 'credit middleAlign': 'middleAlign'}>
                  {row.credit ? row.credit :null}
                </div>
              </td>
              <td>
                <div className={['balance middleAlign']}>
                  {(row.balance && !row.canceled) ? row.balance : null}
                </div>
              </td>
              <td>
                <div className={'middleAlign'}>
                  {row.description}
                </div>
              </td>
              <td>
                <div className={'checkboxWrapper'}>
                  <div className="md-checkbox">
                    <input id={`cancelCheckbox${row.tid}`} value={row.tid} type="checkbox" checked={row.canceled} onChange={onChangeAction} />
                    <label htmlFor={`cancelCheckbox${row.tid}`}></label>
                  </div>
                </div>
              </td>
            </tr>  
          )}
        </tbody>
      </table>
    </div>
  )
};

