const mailchimp = require("@mailchimp/mailchimp_marketing");//require mailchimp module
const express = require("express");//require express
const bodyParser = require("body-parser");//require body parser
const app = express();

app.use(express.static("public"));//use static folder named "public" to store styles.css
app.use(bodyParser.urlencoded({extended: true}));



app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})// sending signup.html 

//mailchimp api config
mailchimp.setConfig({
  apiKey: "Your API Key",
  server: "Server from your API Key"
})


app.post("/", function(req, res) {
  
      //parsing signup.html to get values of first name, last name, email adress
      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      const email = req.body.email;

      const listID = "76aae6c4cd";//mailchimp list ID

      //object for mailchimp
      const subscribingUser = {
        firstName: firstName,
        lastName: lastName,
        email: email
      };
       
      // adding users data to mailchimp list
      // according to mailchimp documentation
      async function run() {
          const response = await mailchimp.lists.addListMember("76aae6c4cd", {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
              FNAME: subscribingUser.firstName,
              LNAME: subscribingUser.lastName
            }
          });
          res.sendFile(__dirname + "/success.html");// if everything is ok send success.html as responce
        }
        run().catch(e => res.sendFile(__dirname + "/failure.html"));//if not, sending send failure.html
      });

      app.post("/failure", (req, res) => {
        res.redirect("/");
      })

      app.listen(3000, () => console.log("Server is running on port 3000"));

      
