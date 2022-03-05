import axios from "axios";
import React, { Component } from "react";
class Landing extends Component {
    constructor() {
        super();
        this.state = {
            pool: 0,
            interest: 0,
            due: 0,
            previous_interest: 0,
            principal: 0,
            collateral: 0,
            rate: 0,
            duetime: 10,
            lent: 0,
            yieldRate: 0,
            username: "",
            usern: "",
            lending_amount: 0,
        }
        this.timer = null
    }

    async componentDidMount() {
        const pool = await axios
            .get("/api/users/getPoolvalue")
            .then((data) => {
                console.log(data.data.pool)
                this.setState({
                    pool: data.data.pool
                })
            })
            .catch(err => {
                console.log(err)
            })

    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onUsername = async (e) => {
        e.preventDefault()
        const user = {
            username: this.state.username
        }

        await axios
            .post("/api/users/register", user)
            .then((data) => {
                console.log(data.data.username)
                this.setState({
                    usern: data.data.username
                })
            })
            .catch(err => {
                console.log(err)
            })

        await axios
            .post("/api/users/getUser", user)
            .then((data) => {
                console.log(data.data.principal)
                this.setState({
                    principal: data.data.principal,
                    collateral: data.data.collateral,
                    rate: data.data.rate,
                    interest: data.data.interest,
                    previous_interest: data.data.previous_interest,
                    lent: data.data.lent_amount,
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    onSubmit = async (e) => {
        e.preventDefault()

        const user = {
            username: this.state.username,
            principal: this.state.principal,
            rate: this.state.rate
        }

        await axios
            .post("/api/users/loanborrow", user)
            .then(async () => {
                this.timer = setTimeout(() => {
                    this.onDefault()
                }, 5000);
                await axios
                    .post("/api/users/getUser", user)
                    .then((data) => {
                        console.log(data.data.principal)
                        this.setState({
                            principal: data.data.principal,
                            collateral: data.data.collateral,
                            rate: data.data.rate,
                            interest: data.data.interest,
                            previous_interest: data.data.previous_interest,
                            lent: data.data.lent_amount,
                        })

                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(err => {
                console.log(err)
            })

    }

    onRepay = async (e) => {
        e.preventDefault()

        const user = {
            username: this.state.username
        }

        await axios
            .post("/api/users/repay", user)
            .then((data) => {
                console.log(data.data.pool)
                clearTimeout(this.timer)
                this.setState({
                    pool: data.data.pool
                })
            })
            .catch(err => {
                console.log(err)
            })

    }

    onLend = async (e) => {
        e.preventDefault()

        const user = {
            username: this.state.username,
            lending_amount: this.state.lending_amount,
        }

        await axios
            .post("/api/users/lend", user)
            .then(async () => {
                await axios
                    .get("/api/users/getPoolvalue")
                    .then((data) => {
                        console.log(data.data.pool)
                        this.setState({
                            pool: data.data.pool
                        })
                    })
                    .catch(err => {
                        console.log(err)
                    })

                await axios
                    .post("/api/users/getUser", user)
                    .then((data) => {
                        this.setState({
                            principal: data.data.principal,
                            collateral: data.data.collateral,
                            rate: data.data.rate,
                            interest: data.data.interest,
                            previous_interest: data.data.previous_interest,
                            lent: data.data.lent_amount,
                        })
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(err => {
                console.log(err)
            })

    }

    onWithdraw = async (e) => {
        e.preventDefault()

        const user = {
            username: this.state.username
        }

        await axios
            .post("/api/users/withdraw", user)
            .then(async () => {
                await axios
                    .get("/api/users/getPoolvalue")
                    .then((data) => {
                        this.setState({
                            pool: data.data.pool
                        })
                    })
                await axios
                    .post("/api/users/getUser", user)
                    .then((data) => {
                        this.setState({
                            lent: data.data.lent_amount
                        })
                    })
            })
            .catch(err => {
                console.log(err)
            })
    }

    onDefault = async () => {
        const user = {
            username: this.state.username
        }

        await axios
            .post("/api/users/default", user)
            .then(async () => {
                await axios
                    .post("/api/users/getUser", user)
                    .then((data) => {
                        this.setState({
                            principal: data.data.principal,
                            collateral: data.data.collateral,
                            rate: data.data.rate,
                            interest: data.data.interest,
                            previous_interest: data.data.previous_interest,
                            lent: data.data.lent_amount,
                        })
                    })
            })
    }



    render() {
        return (
            <div class="">
                <div class="row">
                    <div class="col s6">
                        <div class="row">
                            <div class="col s12 m12">
                                <div class="card blue-grey darken-1">
                                    <div class="card-content white-text">
                                        <span class="card-title">Username</span>
                                        <div className="container">
                                            <div className="row">
                                                <div className="">
                                                    <form noValidate onSubmit={this.onUsername}>
                                                        <div className="input-field col s12">
                                                            <input
                                                                onChange={this.onChange}
                                                                value={this.state.username}
                                                                id="username"
                                                                type="text"
                                                            />
                                                            <label htmlFor="username">Username</label>
                                                        </div>
                                                        <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                                                            <button
                                                                style={{
                                                                    width: "150px",
                                                                    borderRadius: "3px",
                                                                    letterSpacing: "1.5px",
                                                                    marginTop: "1rem"
                                                                }}
                                                                type="submit"
                                                                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                                                            >
                                                                Submit
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <p>Your Username is : {this.state.usern} </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col s6">
                        <div class="row">
                            <div class="col s12 m10">
                                <div class="card blue z-depth-3">
                                    <div class="card-content white-text">
                                        <span class="card-title">Loan Borrow</span>
                                        <div className="container">
                                            <div className="row">
                                                <div className="">
                                                    <form noValidate onSubmit={this.onSubmit}>
                                                        <div className="input-field col s12">
                                                            <input
                                                                onChange={this.onChange}
                                                                value={this.state.principal}
                                                                id="principal"
                                                                type="number"
                                                            />
                                                            <label htmlFor="principal">Principal</label>
                                                        </div>
                                                        <div className="input-field col s12">
                                                            <input
                                                                onChange={this.onChange}
                                                                value={this.state.collateral}
                                                                id="collateral"
                                                                type="number"
                                                            />
                                                            <label htmlFor="principal">Collateral</label>
                                                        </div>
                                                        <div className="input-field col s12">
                                                            <input
                                                                onChange={this.onChange}
                                                                value={this.state.rate}
                                                                id="rate"
                                                                type="number"
                                                            />
                                                            <label htmlFor="rate">Rate</label>
                                                        </div>
                                                        <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                                                            <button
                                                                style={{
                                                                    width: "150px",
                                                                    borderRadius: "3px",
                                                                    letterSpacing: "1.5px",
                                                                    marginTop: "1rem"
                                                                }}
                                                                type="submit"
                                                                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                                                            >
                                                                Borrow
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div></div>
                    <div class="col s6">

                        <div class="row">
                            <div class="col s12 m10">
                                <div class="card blue-grey z-depth-3">
                                    <div class="card-content white-text">
                                        <span class="card-title">Loan Repay</span>
                                        <div className="container">
                                            <div className="row">
                                                <div className="">
                                                    <form noValidate onSubmit={this.onRepay}>
                                                        <div className="input-field col s12">
                                                            <label htmlFor="principal">Due Amount - {this.state.due} </label>
                                                        </div>
                                                        <div className="input-field col s12">
                                                            <label htmlFor="rate">Due Time - {this.state.duetime} </label>
                                                        </div>
                                                        <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                                                            <button
                                                                style={{
                                                                    width: "150px",
                                                                    borderRadius: "3px",
                                                                    letterSpacing: "1.5px",
                                                                    marginTop: "1rem"
                                                                }}
                                                                type="submit"
                                                                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                                                            >
                                                                Repay
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row center-align">
                    <p>Value in Pool: {this.state.pool} </p>
                </div>
                <div class="row">
                    <div class="col s12 m6">
                        <div class="row">
                            <div class="col s12">
                                <div class="card white z-depth-3">
                                    <div class="card-content black-text">
                                        <span class="card-title">Lend</span>
                                        <div class="row">
                                            <div class="container">
                                                <form noValidate onSubmit={this.onLend}>
                                                    <div className="input-field col s12">
                                                        <input
                                                            onChange={this.onChange}
                                                            value={this.state.lending_amount}
                                                            id="lending_amount"
                                                            type="number"
                                                        />
                                                        <label htmlFor="lending_amount">Lend Amount</label>
                                                    </div>
                                                    <div className="input-field col s12">
                                                        <label htmlFor="yieldRate">Yield Rate - {this.state.yieldRate} </label>
                                                    </div>
                                                    <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                                                        <button
                                                            style={{
                                                                width: "150px",
                                                                borderRadius: "3px",
                                                                letterSpacing: "1.5px",
                                                                marginTop: "1rem"
                                                            }}
                                                            type="submit"
                                                            className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                                                        >
                                                            Lend
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col s12 m6">
                        <div class="row">
                            <div class="col s12">
                                <div class="card white z-depth-3">
                                    <div class="card-content black-text">
                                        <span class="card-title">Withdraw</span>
                                        <div class="row">
                                            <div class="container">
                                                <form noValidate onSubmit={this.onWithdraw}>
                                                    <div className="input-field col s12">
                                                        <label htmlFor="lent">Lent Amount - {this.state.lent}</label>
                                                    </div>
                                                    <div className="input-field col s12">
                                                        <label htmlFor="yieldRate">Yield Rate - {this.state.yieldRate} </label>
                                                    </div>
                                                    <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                                                        <button
                                                            style={{
                                                                width: "150px",
                                                                borderRadius: "3px",
                                                                letterSpacing: "1.5px",
                                                                marginTop: "1rem"
                                                            }}
                                                            type="submit"
                                                            className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                                                        >
                                                            Withdraw
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}
export default Landing;