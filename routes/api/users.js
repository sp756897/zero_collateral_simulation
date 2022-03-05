const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");

const Pool = require("../../models/Pool");
const User = require("../../models/User");

router.get("/getPoolvalue", async (req, res) => {
    await Pool.findOne({ user: "sp" })
        .then((data) => {
            res.json(data)
        })
        .catch((err) => {
            res.status(200).json(err)
        })
})

router.post("/getUser", async (req, res) => {
    const username = req.body.username
    await User.findOne({ username })
        .then((data) => {
            res.json(data)
        })
        .catch((err) => {
            res.status(200).json(err)
        })
})

router.post("/refresh", (req, res) => {
    const user = req.body.user
    Pool.count({}, function (err, count) {
        console.log("Number of users:", count);
        if (count == 0) {
            const newPool = new Pool({
                user: user,
                pool: 0
            })
            newPool.save()
                .then((data) => res.json(data))
        }
        else {
            return res.json({ Error: "Filled" })
        }
    })

})

router.post("/register", (req, res) => {

    const username = req.body.username

    User.findOne({ username })
        .then((user) => {
            if (!user) {
                const newUser = new User({
                    username: username,
                    first_time: true
                })

                newUser.save()
                    .then((data) => res.json(data))
                    .catch(err => res.status(200).json(err))
            }
            else {
                return res.json(user)
            }
        })


});

router.post("/lend", async (req, res) => {
    const username = req.body.username
    const lending_amount = req.body.lending_amount

    await User.findOneAndUpdate({ username }, {
        $inc: {
            lent_amount: lending_amount
        }
    })

    await Pool.findOneAndUpdate({ user: "sp" }, {
        $inc: {
            pool: lending_amount
        }
    })
        .then((data) => {
            return res.json(data)
        })
})

router.post("/withdraw", async (req, res) => {
    const username = req.body.username

    await User.findOne({ username })
        .then(async (data) => {
            await User.findOneAndUpdate({ username }, {
                $set: {
                    lent_amount: 0
                }
            })

            await Pool.findOneAndUpdate({ user: "sp" }, {
                $inc: {
                    pool: -data.lent_amount
                }
            })
                .then(data => res.json(data))
        })
})

router.post("/repay", async (req, res) => {
    const username = req.body.username

    await User.findOne({ username })
        .then(async (data) => {
            var due_payback = (data.principal - Number((data.interest / 3))) + Number(data.interest)
            await Pool.findOneAndUpdate({ user: "sp" },
                {
                    $inc: {
                        pool: due_payback
                    }
                })
                .then((data) => res.json(data))
        })
})

router.post("/default", async (req, res) => {
    const username = req.body.username

    await User.findOneAndUpdate({ username },
        {
            $set: {
                principal: 0,
                collateral: 0,
                interest: 0,
                previous_interest: 0,
                first_time: true,
                rate: 8
            }
        })
        .then((data) => {
            res.json(data)
        })
})

router.post("/loanborrow", async (req, res) => {
    const username = req.body.username

    await User.findOne({ username })
        .then(async (data) => {
            if (data.first_time == true) {

                var principal = parseInt(req.body.principal)
                const rate = parseInt(req.body.rate)
                console.log(principal)

                await Pool.findOne({ user: "sp" })
                    .then(async (pooldata) => {
                        var pool = pooldata.pool
                        if (pool > principal) {
                            var interest = 0
                            var previous_interest = 0
                            var collateral = principal
                            pool = pool - principal + collateral
                            interest = principal * (rate / 100)
                            console.log(principal, interest)
                            let inter = (interest / 3)
                            let i = inter.toPrecision(4);
                            console.log(i)
                            principal += Number(i)
                            console.log(principal)
                            collateral = collateral - ((interest + previous_interest) / 3)
                            previous_interest = interest

                            await Pool.findOneAndUpdate({ user: "sp" },
                                {
                                    $set: {
                                        pool: pool
                                    }
                                })

                            await User.findOneAndUpdate({ username }, {
                                $set: {
                                    principal: principal,
                                    collateral: collateral,
                                    rate: rate,
                                    interest: interest,
                                    previous_interest: previous_interest,
                                    first_time: false
                                }
                            })
                                .then((data) => {
                                    return res.json(data)
                                })
                        }
                        else {
                            return res.status(400).json({ Error: "Not enough cash in pool" })
                        }
                    })
            }
            else {
                await User.findOne({ username })
                    .then(async (data) => {
                        var principal = data.principal
                        var collateral = data.collateral
                        var rate = data.rate
                        var interest = data.interest
                        var previous_interest = data.previous_interest
                        let pool = 0

                        await Pool.findOne({ user: "sp" })
                            .then(async (pooldata) => {
                                pool = pooldata.pool
                                console.log(pool, principal)
                                if (pool > principal) {
                                    pool = pool - principal + collateral
                                    console.log(pool, principal)
                                    interest = principal * (rate / 100)
                                    principal = principal + (interest / 3)
                                    collateral = collateral - ((interest + previous_interest) / 3)
                                    previous_interest = interest


                                }
                                else {
                                    return res.status(400).json({ Error: "Not enough cash in pool" })
                                }

                            })

                        console.log(pool)
                        await Pool.findOneAndUpdate({ user: "sp" },
                            {
                                $set: {
                                    pool: Number(pool)
                                }
                            })
                        await User.findOneAndUpdate({ username }, {
                            $set: {
                                principal: principal,
                                collateral: collateral,
                                rate: rate,
                                interest: interest,
                                previous_interest: previous_interest
                            }
                        }).then((data) => {
                            return res.json(data)
                        })

                    })


            }
        })



})

module.exports = router;