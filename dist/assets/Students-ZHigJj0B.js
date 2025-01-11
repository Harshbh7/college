import{t as b,j as t,r as d,v as m,B as l,E as H,D as L,w as P,x as T,y as W,z}from"./index-DmwclU9Y.js";import{S as r}from"./sweetalert2.esm.all-BkU8I-GU.js";const B=b(t.jsx("path",{d:"M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8"}),"AddCircleOutline"),O=b(t.jsx("path",{d:"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"}),"Delete"),k=b(t.jsx("path",{d:"M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3m-3 11H8v-5h8zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1m-1-9H6v4h12z"}),"Print"),G=()=>{const[S,c]=d.useState([]),[y,g]=d.useState(!0),[w,o]=d.useState(!1),[u,x]=d.useState(!1),[j,E]=d.useState(null),[i,f]=d.useState({sr:"",en:"",rollNo:"",wrn:"",name:"",fathername:"",email:"",gender:"",mobile:"",address:""}),h="https://college-fde10-default-rtdb.firebaseio.com/student_list.json";d.useEffect(()=>{v()},[]);const v=async()=>{g(!0);try{const n=(await m.get(h)).data||{},s=Object.keys(n).map(a=>({...n[a],id:a})).sort((a,p)=>parseInt(a.sr||0)-parseInt(p.sr||0));c(s)}catch{r.fire("Error","Failed to fetch students","error")}finally{g(!1)}},I=e=>{const{name:n,value:s}=e.target;f(a=>({...a,[n]:s}))},N=()=>{x(!1),f({sr:"",en:"",rollNo:"",wrn:"",name:"",fathername:"",email:"",gender:"",mobile:"",address:""}),o(!0)},A=async()=>{try{const e=S.reduce((a,p)=>Math.max(a,parseInt(p.sr)||0),0),n={...i,sr:e+1},s=await m.post(h,n);c(a=>[...a,{...n,id:s.data.name}]),r.fire("Success","Student added successfully","success"),o(!1)}catch{r.fire("Error","Failed to add student","error")}},D=e=>{x(!0),E(e.id),f({sr:e.sr||"",en:e.en||"",rollNo:e.rollNo||"",wrn:e.wrn||"",name:e.name||"",fathername:e.fathername||"",email:e.email||"",gender:e.gender||"",mobile:e.mobile||"",address:e.address||""}),o(!0)},M=async()=>{try{const e={...i};await m.put(`${h.replace(".json",`/${j}.json`)}`,e),c(n=>n.map(s=>s.id===j?{...e,id:j}:s)),r.fire("Success","Student updated successfully","success"),o(!1)}catch{r.fire("Error","Failed to update student","error")}},F=async e=>{r.fire({title:"Are you sure?",text:"This action cannot be undone!",icon:"warning",showCancelButton:!0,confirmButtonColor:"#d33",cancelButtonColor:"#3085d6",confirmButtonText:"Yes, delete it!"}).then(async n=>{if(n.isConfirmed)try{await m.delete(`${h.replace(".json",`/${e}.json`)}`),c(s=>s.filter(a=>a.id!==e)),r.fire("Deleted!","Student has been deleted.","success")}catch{r.fire("Error","Failed to delete student","error")}})},C=()=>{o(!1),x(!1)},R=()=>{const e=document.querySelector(".students-container table").outerHTML,n=document.createElement("iframe");n.style.position="absolute",n.style.top="-10000px",document.body.appendChild(n);const s=n.contentDocument||n.contentWindow.document;s.open(),s.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Students List</title>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid black;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
          </style>
        </head>
        <body>
          <h1>Students List</h1>
          ${e}
        </body>
      </html>
    `),s.close(),n.contentWindow.focus(),n.contentWindow.print(),setTimeout(()=>document.body.removeChild(n),1e3)};return y?t.jsx("div",{children:"Loading..."}):t.jsxs("div",{className:"students-container",children:[t.jsx(l,{onClick:N,startIcon:t.jsx(B,{}),children:"Add Student"}),t.jsx(l,{onClick:R,startIcon:t.jsx(k,{}),children:"Print"}),t.jsxs("table",{children:[t.jsx("thead",{children:t.jsxs("tr",{children:[t.jsx("th",{children:"SR"}),t.jsx("th",{children:"EN"}),t.jsx("th",{children:"Roll No"}),t.jsx("th",{children:"WRN"}),t.jsx("th",{children:"Name"}),t.jsx("th",{children:"Father Name"}),t.jsx("th",{children:"Email"}),t.jsx("th",{children:"Gender"}),t.jsx("th",{children:"Mobile"}),t.jsx("th",{children:"Address"}),t.jsx("th",{children:"Actions"})]})}),t.jsx("tbody",{children:S.map(e=>t.jsxs("tr",{children:[t.jsx("td",{"data-label":"SR",children:e.sr}),t.jsx("td",{"data-label":"EN",children:e.en}),t.jsx("td",{"data-label":"Roll No",children:e.rollNo}),t.jsx("td",{"data-label":"WRN",children:e.wrn}),t.jsx("td",{"data-label":"Name",children:e.name}),t.jsx("td",{"data-label":"Father Name",children:e.fathername}),t.jsx("td",{"data-label":"Email",children:e.email}),t.jsx("td",{"data-label":"Gender",children:e.gender}),t.jsx("td",{"data-label":"Mobile",children:e.mobile}),t.jsx("td",{"data-label":"Address",children:e.address}),t.jsxs("td",{"data-label":"Actions",children:[t.jsx(l,{onClick:()=>D(e),startIcon:t.jsx(H,{}),children:"Edit"}),t.jsx(l,{onClick:()=>F(e.id),startIcon:t.jsx(O,{}),children:"Delete"})]})]},e.id))})]}),t.jsxs(L,{open:w,onClose:C,children:[t.jsx(P,{children:u?"Edit Student":"Add Student"}),t.jsx(T,{children:Object.keys(i).map(e=>t.jsx(W,{name:e,label:e.toUpperCase(),value:i[e],onChange:I,fullWidth:!0,margin:"dense",disabled:e==="sr"},e))}),t.jsxs(z,{children:[t.jsx(l,{onClick:C,children:"Cancel"}),t.jsx(l,{onClick:u?M:A,children:u?"Update":"Add"})]})]})]})};export{G as default};
