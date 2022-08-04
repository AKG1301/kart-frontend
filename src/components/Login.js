import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Input, message } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
/**
 * @class Login component handles the Login page UI and functionality
 *
 * Contains the following fields
 *
 * @property {boolean} state.loading
 *    Indicates background action pending completion. When true, further UI actions might be blocked
 * @property {string}
 *    state.username User given field for username
 * @property {string}
 *    state.password User given field for password
 */
class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      username: "",
      password: "",
    };
  }

  validateInput = () => {
    debugger
    let username = this.state.username;
    let password = this.state.password;
    var count =0;
    let error = {
      password:"",
      username:"",
    }
    if((username.length ===0 )){
      error.username = "username should not be empty"
    }
    if((password.length === 0 )){
      error.password = "password should not be empty"
    }
    Object.values(error).forEach(ele => {
      if(ele.length === 0){
        count+=1;
      }
    })
    var k =Object.values(error).length;
    if(k === 2 && count ===2){
      return true
    }else {
      return false
    }
  };
 
  validateResponse = (errored, responseJosn) => {
    if(errored){
      return false;
    }else{
      if(responseJosn.success === false){
        message.error(responseJosn.message)
        return false;
      }else{
        return true
      }
    }
  };
 
  performAPICall = async () => {
    let error = false
    this.setState(function(prevState) {
      return {
        loading: true
      }
    })
    try{
      const response = fetch(`${config.endpoint}/auth/login`,{
        method:"POST",
        body: JSON.stringify({
          username:this.state.username,
          password:this.state.password
        }),
        headers:{
          "content-type":"application/json"
        }
      })
      const responseDetain = await response;
      debugger
      if(responseDetain.status !== 200 && responseDetain.status !== 400){
         error = true;
      }// this if is not needed you can directly make the error = true in catch block becasuse when there is error it will mov e to catch
      const responseJosn = await responseDetain.json();
     if(responseJosn){ // no need to check also once you do it outside
      this.setState(function(prevState) {
        return {
          loading: false
        }
      })
    }
      const validateresopnserslt = this.validateResponse(error , responseJosn)
      if(validateresopnserslt){
        return responseJosn
      }
      else{
        return false;
      }
     // do these above two things outside the try catch after the request completes.
     // setting the loading to false and returning the json
    }
    catch(err){
console.log("sometheing error")
    }
  };
  
  persistLogin = (token, username, balance) => {
    localStorage.setItem("token", token)
    localStorage.setItem("username", username)
    localStorage.setItem("balance", balance)
  };
 
  login = async () => {
    debugger
    let l =this.validateInput()
     if(l){
        const res= await this.performAPICall();
        if(res !== false){
            debugger
            this.persistLogin(res.token,res.username,res.balance)
            // you have to set the state here also
            this.setState(prevState => {
          return {
            username: "",
            password: "",
          }
        });
            message.success("login successful")
            this.props.history.push("/products");
        }
     }else{
     message.error("feilds cannot be empty")
     }
  };
  /**
   * JSX and HTML goes here
   * We have a text field and a password field (each with data binding to state), and a submit button that calls login()
   */
  render() {
    return (
      <>
        {/* Display Header */}
        <Header history={this.props.history} />
        {/* Display Login fields */}
        <div className="flex-container">
          <div className="login-container container">
            <h1>Login to KART</h1>
            <Input
              className="input-field"
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
              onChange={(e) => {
                this.setState({
                  username: e.target.value,
                });
              }}
            />
            <Input.Password
              className="input-field"
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="Password"
              onChange={(e) => {
                this.setState({
                  password: e.target.value,
                });
              }}
            />
            <Button
              loading={this.state.loading}
              type="primary"
              onClick={this.login}
            >
              Login
            </Button>
          </div>
        </div>
        {/* Display the footer */}
        <Footer></Footer>
      </>
    );
  }
}
export default withRouter(Login);