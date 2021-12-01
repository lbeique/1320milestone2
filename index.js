const express = require("express");
const PORT = process.env.PORT || 8007;
const app = express();
const fs = require("fs").promises;

// Don't worry about these 4 lines below
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("createcard");
});

app.get("/homepage", (req, res) => {
  res.render("homepage");
});

app.post("/myForm", async (req, res) => {
  try {
    let newUser = req.body;
    newUser.id = newUser.fullName + Math.random().toString(26).substring(5);
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
    await fs.writeFile("database.json", JSON.stringify(parsedContent));
    res.redirect(`/people/${newUser.id}`);
  } catch (err) {
    console.error(err);
  } finally {
    console.log("Things are broken!");
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
