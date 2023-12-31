import React, { useEffect, useState } from "react";
import Question from "../UI/Question";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./Quiz.module.css"; // Import the CSS module
import { useDispatch } from "react-redux";
import { questionActions } from "../Store/Store";
import Form from "../UI/Form";
const Quiz = (props) => {
  const [question,setQuestions]=useState([]);
  const [showForm,setShowForm]=useState(false);
  const [file, setFile] = useState(null);
  const {id}=useParams();
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const fetchData=async ()=>{
   const response=await fetch(`http://localhost:8080/api/v1/teachers/quiz/${id}`);
   const data=await response.json();
   setQuestions(data)
  }

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const importHandler=async(event)=>{
    event.preventDefault();
    const formData = new FormData();
    formData.append('pdf_file', file);
    const response=await fetch('http://localhost:8080/api/v1/teachers/quiz/upload',{
      method:"POST",
      body:formData
    })

  }
  const quizSaveHandler=()=>
  {
     setTimeout(()=>{navigate('/teacher/manage')},3000);
  }
  
  const showFormHandler=()=>{
    setShowForm(prevState=>!prevState);
  }

  const deleteHandler=async ()=>{
    const response = await fetch(`http://localhost:8080/api/v1/teachers/quiz/${id}`,{
      method:"DELETE",
      body:JSON.stringify({id})
    })
   
    if(response.ok)
    {
      navigate('/teacher/manage')
    }
  }

  const questionDeleteHandler=async(Question)=>{
    const response = await fetch(`http://localhost:8080/api/v1/teachers/quiz/${id}/${Question}`,{
      method:"DELETE",
      body:JSON.stringify({id,Question})
    })

    if(response.ok)
    {
      window.location.reload();
    }
  }
  useEffect(()=>{
    dispatch(questionActions.addQuiz(id))
    fetchData()
  },[])

  const empty=question.length===0;
  return (
  
    <div className={styles.quizContainer}>
      {question.map((el) =>{ 
        if(!el.Question)
        {
          return null;
        }
        return (
        <Question
          Question={el.Question}
          Option1={el.Option1}
          Option2={el.Option2}
          Option3={el.Option3}
          Option4={el.Option4}
          name={el.Question}
          className={styles.question} // Apply question class
           deleteHandler={questionDeleteHandler}
        />
      )})}
      <form className={styles.uploadForm}>
      <input type="file" name="pdfInput" accept=".pdf" onChange={onFileChange}/>
      <button className={styles.formButton} onClick={importHandler}>Import From Pdf</button>
      </form>
       <button className={`${styles.formButton} ${styles.toggleButton}`} onClick={showFormHandler}> {showForm ?"Hide":"Show"} Form</button>
      {showForm && <Form/>}
        <button className={styles.formButton} onClick={quizSaveHandler}>Save</button>
        <button className={styles.formButton} onClick={deleteHandler}>Delete</button>
    </div>

  );
};

export default Quiz;
