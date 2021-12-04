const express = require("express");
const PORT = process.env.PORT || 8007;
const app = express();
const fs = require("fs").promises;

// Don't worry about these 4 lines below
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// // This function reads the local storage and returns an object
// const readLocalStorage = (localItem) => {
//   return JSON.parse(window.localStorage.getItem(localItem));
// }

// // This function takes an object and writes it to local storage
// const writeLocalStorage = (user, local) => {
// window.localStorage.setItem(local, JSON.stringify(user));
// }

app.get("/", (req, res) => {
  res.render("createcard");
});

// This is currently broken, it needs a user to render the page
app.get("/homepage", (req, res) => {
  // user = readLocalStorage('userID');
  // if (user) {
  // res.render("homepage", { user });
  // } else {
    res.redirect("/");
  // }
});

app.post("/myForm", async (req, res) => {
  try {
    // window.localStorage.clear();
    let newUser = req.body;
    if (!newUser.fullName) {
      res.redirect("/");
    }
      newUser.id = newUser.fullName.split(' ')[0] + Math.random().toString(26).substring(5);
      const {
        fullName,
        aboutMe,
        knownTechnologies,
        githubUrl,
        twitterUrl,
        favoriteBooks,
        favoriteArtists,
        id,
      } = newUser;
      // writeLocalStorage(newUser, 'userID');
      const content = await fs.readFile("database.json", "utf-8");
      const parsedContent = JSON.parse(content);
      parsedContent.users.push({
        fullName,
        aboutMe,
        knownTechnologies,
        githubUrl,
        twitterUrl,
        favoriteBooks,
        favoriteArtists,
        id,
      });
      await fs.writeFile("database.json", JSON.stringify(parsedContent, null, "\t"));
      res.redirect(`/people/${newUser.id}`);
    } catch (err) {
      console.error(err);
    }
});

app.get("/people/:id", async (req, res) => {
    const id = req.params.id;
    const databaseContent = await fs.readFile("database.json", "utf-8").catch(err => console.log(err));
    const users = JSON.parse(databaseContent).users;
    const user = users.find((user) => user.id === id);
    res.render("homepage", { user });
});

app.get("/:id/photos", (req, res) => {
  const id = req.params.id;
});

app.listen(PORT, () => {
  console.log(`Server now is running at http://localhost:${PORT} 🚀`);
});


