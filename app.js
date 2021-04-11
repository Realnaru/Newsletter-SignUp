const mailchimp = require("@mailchimp/mailchimp_marketing");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));



app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})

mailchimp.setConfig({
  apiKey: "843e7912def9a52f14f32a1e2f790de0-us1",
  server: "us1"
})

app.post("/", function(req, res) {

      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      const email = req.body.email;

      const listID = "76aae6c4cd";

      const subscribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email
      };

      async function run() {
          const response = await mailchimp.lists.addListMember("76aae6c4cd", {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
              FNAME: subscribingUser.firstName,
              LNAME: subscribingUser.lastName
            }
          });
          res.sendFile(__dirname + "/success.html");
        }
        run().catch(e => res.sendFile(__dirname + "/failure.html"));
      });

      app.post("/failure", (req, res) => {
        res.redirect("/");
      })

      app.listen(3000, () => console.log("Server is running on port 3000"));
      // API key
      // 843e7912def9a52f14f32a1e2f790de0-us1

      // List //
      // 76aae6c4cd
