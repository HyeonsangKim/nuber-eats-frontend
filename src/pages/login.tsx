import React from "react";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet";
import { FormError } from "../components/form-error";
import { gql, useMutation } from "@apollo/client";
import {
  loginMutation,
  loginMutationVariables,
} from "../__generated__/loginMutation";
import { Button } from "../components/button";
import { Link } from "react-router-dom";
import { authTokenVar, isLoggedInVar } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../constants";

const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;

interface ILoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const {
    register,
    getValues,
    watch,
    formState,
    formState: { errors },
    handleSubmit,
  } = useForm<ILoginForm>({
    mode: "onChange",
  });

  const onCompleted = (data: loginMutation) => {
    const {
      login: { error, ok, token },
    } = data;
    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      authTokenVar(token);
      isLoggedInVar(true);
    }
  };

  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  });

  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      loginMutation({
        variables: {
          loginInput: {
            email,
            password,
          },
        },
      });
    }
  };

  return (
    <div className='h-screen flex items-center flex-col mt-10 lg:mt-28'>
      <Helmet>
        <title>Login | Nuber Eats</title>
      </Helmet>
      <div className='w-full max-w-screen-sm flex flex-col px-5 items-center'>
        <img
          src='https://www.ubereats.com/_static/8b969d35d373b512664b78f912f19abc.svg'
          className='w-52 mb-10'
        />
        <h4 className='w-full font-medium text-left text-3xl mb-5'>
          Welcome back
        </h4>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='grid gap-3 mt-5 w-full mb-5'
        >
          <input
            className='input'
            {...register("email", {
              required: "Email is required",
              pattern:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            name='email'
            type='email'
            placeholder='Email'
          />
          {errors.email?.message && (
            <span className='font-medium text-red-500'>
              <FormError errorMessage={errors.email?.message} />
            </span>
          )}
          {errors.email?.type === "pattern" && (
            <span className='font-medium text-red-500'>
              <FormError errorMessage={"Please enter a valid email"} />
            </span>
          )}
          <input
            {...register("password", {
              required: "Password is required",
              //minLength: 10,
            })}
            name='password'
            type='password'
            placeholder='password'
            className='input'
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          {errors.password?.type === "minLength" && (
            <FormError errorMessage=' Password must be more than 10 chars.' />
          )}
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText='Login'
          />
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
        <div>
          New to Nuber?{" "}
          <Link to='/create-account' className='text-lime-600 hover:underline'>
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
