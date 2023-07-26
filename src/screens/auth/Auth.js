import React, { useState, createRef, useEffect } from 'react'
import './Auth.css';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../components/Loading/Loading';
import { Navigate } from 'react-router-dom';
import { loginAsync, twoFAAsync } from '../../features/auth/authSlice';

const TwoFAView = () => {
  const dispatch = useDispatch();
  const numberOfInputs = 6;
  const [inputRefsTwoFAArray] = useState(() => Array.from({ length: numberOfInputs }, () => createRef()));
  // eslint-disable-next-line
  const [currentIndex, setCurrentIndex] = useState(0);
  const [twoFAForm, setTwoFAForm] = useState(() => Array.from({ length: numberOfInputs }, () => ""));
  const handleTwoFAKeyPress = (e) => {
    const { key, target } = e;
    const { value } = target;
    const backspace = key === "Backspace" || key === "Delete"

    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex < numberOfInputs - 1 ? value === "" ? prevIndex : prevIndex + 1 : 5;
      nextIndex = backspace ? prevIndex === 0 ? nextIndex : nextIndex - 1 : nextIndex;
      const nextInput = inputRefsTwoFAArray?.[nextIndex]?.current;
      nextInput.focus();
      nextInput.select();
      return nextIndex;
    });
  };

  useEffect(() => {
    if (inputRefsTwoFAArray?.[0]?.current) {
      inputRefsTwoFAArray?.[0]?.current?.focus();
    }

    window.addEventListener("keyup", handleTwoFAKeyPress, false);
    
    return () => window.removeEventListener("keyup", handleTwoFAKeyPress);
    // eslint-disable-next-line
  }, []);

  const handleTwoFASubmit = (e) => {
    e.preventDefault();
    let string = "";
    for(let i = 0; i < numberOfInputs; i++) {
      string += twoFAForm[i];
    }

    dispatch(twoFAAsync(string));
  }

  return (
    <div className="authScreen">
      <div className="container">
        <div className="logoContainer">
          <h1 className="logo">Creators</h1>
        </div>
        <form className='formContainer' onSubmit={handleTwoFASubmit}>
          <div className="twoFaFormContainer">
            {
              inputRefsTwoFAArray.map((ref, index) => {
                return (
                  <input
                    key={index}
                    ref={ref}
                    type="text"
                    id={`box${index}-1`}
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/[^\d]/,'-');
                      setTwoFAForm((letters) =>
                        letters.map((letter, letterIndex) =>
                          letterIndex === index ? e.target.value : letter
                        )
                      );
                    }}
                    onClick={(e) => {
                      setCurrentIndex(index);
                      e.target.select();
                    }}
                    value={twoFAForm[index] === '-' ? "" : twoFAForm[index]}
                    max={"1"}
                    className='twoFABox'
                  />
                );
              })
            }
          </div>
          <button type="submit">Send Code</button>
        </form>
      </div>
    </div>
  )
}

const LoginView = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm((state) => {
      return { ...state, [e.target.name]: e.target.value}
    })
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    const { username, password } = form;

    dispatch(loginAsync({ username, password }));
  }

  return (
    <div className='authScreen'>
      <div className="container">
        <div className="logoContainer">
          <h1 className="logo">Creators</h1>
        </div>
        <form className='formContainer' onSubmit={handleLoginSubmit}>
          <input placeholder='Username/Telegram ID' type="text" name='username' value={form.username} onChange={handleChange} />
          <input placeholder='Password' type="password" name='password' value={form.password} onChange={handleChange} />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  )
}

const Auth = () => {
  const authData = useSelector(state => state.auth);

  if (authData.status === 'loading') {
    return <Loading />
  }

  if (authData.isAuthenticated) {
    return <Navigate to='/dashboard' />
  }

  if(authData.is2FA) {
    return <TwoFAView />
  } else {
    return <LoginView />
  }
}

export default Auth