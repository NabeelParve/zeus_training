const button = document.getElementById('submit')
const name_field = document.getElementById('name')
const comment_field = document.getElementById('comments')


button.addEventListener('click',(e)=>{
    e.preventDefault()
    document.getElementById('radio').style.border = 'none'
    let name = name_field.value
    let comment = comment_field.value
    let gender
    try{
        gender = document.querySelector('input[name="gender"]:checked').value;
    }
    catch(err){
        gender = ""
    }
    if(name.length === ""  || comment === "" || gender === ""){
        alert("All field are compulsory!")
    }
    else{
        console.log("Form Submitted")
    }

    if(name===""){
        name_field.focus()
    }else if(comment===""){
        comment_field.focus()
    }else if(gender === ""){
        document.getElementById('radio').style.border = '1px solid #000000'
    }

    
})