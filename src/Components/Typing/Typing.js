import React, { useEffect, useRef, useState } from 'react'
import "./typing.css"

const para = "Stimulate your mind as you test your typing speed with this standard English paragraph typing test. Watch your typing speed and accuracy increase as you learn about a variety of new topics! Over 40 typing test selections available."

const Typing = () => {


    const maxTime = 60
    const [timeLeft, setTimeLeft] = useState(maxTime)
    const [mistake, setMistake] = useState(0)
    const [WPM, setWPM] = useState(0)
    const [CPM, setCPM] = useState(0)
    const [charIndex, setCharIndex] = useState(0)
    const [isTyping, setIsTyping] = useState(false)
    const [correctWrong, setCorrectWrong] = useState([])

    const inputRef = useRef(null)
    const charRefs = useRef([])

    useEffect(()=>{
        inputRef.current.focus()
        setCorrectWrong(Array(charRefs.current.length).fill(''))
    },[])

    useEffect(()=>{
      let interval
      if(isTyping && timeLeft > 0){
        interval = setInterval(()=>{
         setTimeLeft(timeLeft-1)
         let correctChars = charIndex - mistake
         let totalTime = maxTime - timeLeft
         
         let cpm = correctChars * (60 / totalTime)
         cpm = cpm < 0 || !cpm || cpm  === Infinity ? 0 : cpm
         setCPM(parseInt(cpm,10))

         let wpm = Math.round((correctChars / 5 /totalTime)*60)
         wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm
         setWPM(wpm)
        },1000)
      }else if(timeLeft === 0){
        clearInterval(interval)
        setIsTyping(false)
      }
      return ()=>{
        clearInterval(interval)
      }
    },[isTyping,timeLeft])

    const handelChange = (e)=>{
        const character = charRefs.current
        let currentChar = charRefs.current[charIndex]
        let typeChar = e.target.value.slice(-1)
        if(charIndex < character.length && timeLeft > 0){
            if(!isTyping){
                setIsTyping(true)
            }
            if(typeChar === currentChar.textContent){
                setCharIndex(charIndex + 1)
                correctWrong[charIndex] = " correct "
            }else{
                setCharIndex(charIndex + 1)
                setMistake(mistake + 1)
                correctWrong[charIndex] = " wrong "
            }
            if(charIndex === character.length - 1) setIsTyping(false)
        }else{
            setIsTyping(false)
        }
    }

    const reset = ()=>{
      setIsTyping(false);
      setTimeLeft(maxTime)
      setCharIndex(0)
      setMistake(0)
      setCPM(0)
      setWPM(0)
      setCorrectWrong(Array(charRefs.current.length).fill(''))
      inputRef.current.focus()
    }

  return (
    <div className='container'>
      <div className='text'>
        <input type='text' className='input-field' ref={inputRef} onChange={handelChange} />
        {
            para.split("").map((char, index)=>(
                <span className={`char ${index === charIndex ? 'active' : ''} ${correctWrong[index]}`} ref={(e)=>charRefs.current[index] = e}>{char}</span>
            ))
        }
      </div>
      <div className='result'>
        <p>Time Left: <strong>{timeLeft}</strong></p>
        <p>Mistake: <strong>{mistake}</strong></p>
        <p>WPM: <strong>{WPM}</strong></p>
        <p>CPM: <strong>{CPM}</strong></p>
        <button className='btn' onClick={reset}>Try Again</button>
      </div>
    </div>
  )
}

export default Typing
