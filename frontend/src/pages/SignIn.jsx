import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../store/auth';

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const [data, setData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const change = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const submit = async () => {
    try {
      if (data.username === '' || data.password === '') {
        alert('All fields are required');
        return;
      }

      const res = await axios.post('http://localhost:1000/api/v1/sign-in', data);
      console.log('API Response:', res.data);
      localStorage.setItem('id', res.data.id);
      localStorage.setItem('token', res.data.token);

      dispatch(authActions.login());
      navigate('/');

    } catch (error) {
      console.log('Error:', error);
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="bg-gray-800 h-[93vh] flex items-center justify-center m-5">
      <div className="p-4 w-2/5 rounded bg-gray-900">
        <div className="text-xl mb-5 font-bold">Sign In</div>
        {error && <div className="text-red-500 mb-3">{error}</div>}
        <input
          type="text"
          placeholder="Username"
          name="username"
          className="px-5 py-2 w-full rounded bg-zinc-300 text-gray-900 mb-3"
          onChange={change}
          value={data.username}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          className="px-5 py-2 w-full rounded bg-zinc-300 text-gray-900 mb-6"
          onChange={change}
          value={data.password}
        />
        <div className="flex items-center justify-between">
          <button
            onClick={submit}
            className="px-3 py-2 rounded bg-gray-700 my-3"
          >
            Sign In
          </button>
          <Link to="/sign-up" className="text-gray-400 font-semi-bold">
            Don't have an Account? Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
