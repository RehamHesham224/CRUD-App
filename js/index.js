// Declare Main Variable with selectors
const
    formEmp=document.getElementById('formEmp'), 
    inputName=document.getElementById('name'),
    inputEmail=document.getElementById('email'),
    inputMobile=document.getElementById('mobile'),
    tableBody=document.querySelector('#example tbody'),
    submit=document.getElementById('submit'), 
    contIdEdit=document.getElementById('contIdEdit');

class Employee{
    //get data from user
    constructor(id,name,email,mobile){
        this.id=id;
        this.name=name;
        this.email=email;
        this.mobile=mobile; 
    }  
    //show data get from user on html
    showData(){
        Employee.showHtml(this.id,this.name,this.email,this.mobile);
        return this;
    }
    // store data in local storage and get data from local storage
    storeEmployee(){
        const allData=JSON.parse(localStorage.getItem('employees'))??[];
        allData.push({id:this.id,name:this.name,email:this.email,mobile:this.mobile});
        localStorage.setItem('employees',JSON.stringify(allData));
    }
    //loop on data from local storage and show it on html
    static showAllEmployees(){
        if(localStorage.getItem('employees'))
        {
            JSON.parse(localStorage.getItem('employees')).forEach((item)=>{
                Employee.showHtml(item.id,item.name,item.email,item.mobile);
                
            })
            
        }

    }
    //update Element 
    updateEmployee(id){
        const newItem={id:id,name:this.name,email:this.email,mobile:this.mobile};
        //return edited item and other items 
        const updateData=JSON.parse(localStorage.getItem("employees")).map((item)=>{
            if(item.id == id){
                return newItem;
            }
            return item;
        })
        
        //add edited item and other items to local storage
        localStorage.setItem("employees",JSON.stringify(updateData));
    }
    //show data in html
    static showHtml(id,name,email,mobile){
        const trEl= document.createElement('tr');
        trEl.innerHTML=`
            <tr  role='row'>
                <td>${name} </td>
                <td>${email}</td>
                <td>${mobile}</td>
                <td>
                    <button class="btn btn-info edit" data-id="${id}">Edit</button>
                    <button class="btn btn-danger delete" data-id="${id}">Delete</button>
                </td>
            </tr>
        `;
        tableBody.appendChild(trEl);
    }
}
//call function global to show data from local storage  when you reload page
Employee.showAllEmployees();
//when you submit the form
formEmp.addEventListener("submit",(e)=>{
    //stop default behavior of submit
    e.preventDefault();

    //empty input=>you add
    if(!contIdEdit.value){
        //*******************Add Item**********************
        //get random id
        let id=Math.floor(Math.random()*1000000);
        //object of the class
        const newEmp =new Employee(id,inputName.value,inputEmail.value,inputMobile.value);
        //chain function show data get from user in table then store it on local storage
        newEmp.showData().storeEmployee();
        
    }else{
        //*******************Update Item Item**********************
        //save id in hidden input
        const id=contIdEdit.value;
        //make an object of the class with id of edit item
        const newEmp =new Employee(id,inputName.value,inputEmail.value,inputMobile.value);
        newEmp.updateEmployee(id);
        //return value of submit button to normal 
        submit.value="Store This Data";
        //make table empty
        tableBody.innerHTML="";
        //reload content of the table
        Employee.showAllEmployees();
    }
    //make all inputs empty 
    inputName.value='';
    inputEmail.value='';
    inputMobile.value='';
    contIdEdit.value='';
})
tableBody.addEventListener("click",(e)=>{

//***************remove Element***********************

    if(e.target.classList.contains("delete")){
        //select id of deleted item
        const id=+e.target.getAttribute("data-id");
        //remove item from local storage with filter
        const emps=JSON.parse(localStorage.getItem('employees'))
        const newData = emps.filter((el)=>el.id != +id);
        localStorage.setItem("employees",JSON.stringify(newData));
        //remove element from html
        e.target.parentElement.parentElement.remove();
    }

//***************edit Element***********************

if(e.target.classList.contains("edit")){
    //select id of edited item
    const id= +e.target.getAttribute("data-id");
    //edit item in local storage
    const mainItem=JSON.parse(localStorage.getItem('employees')).find(item=>item.id === id)
    //add values of edit item to inputs
    inputName.value=mainItem.name;
    inputMobile.value=mainItem.mobile;
    inputEmail.value=mainItem.email;
    //add id of edit item to hidden input
    contIdEdit.value=id;
    //change value of submit during editing
    submit.value="Edit This Item";

    
}
})
