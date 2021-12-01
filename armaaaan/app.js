const express = require("express");
const fs = require("fs").promises;

const app = express();
app.use(express.static("public"));
app.use(express.urlencoded());

app.set("view engine", "ejs");

app.post("/addRecipe", async (req, res) => {
  console.log(req.body);
  const { recipeName, author } = req.body;
  const content = await fs.readFile("database.json", "utf-8");
  const parsedContent = JSON.parse(content);
  parsedContent.recipes.push({ recipeName, author });
  await fs.writeFile("database.json", JSON.stringify(parsedContent));
  res.redirect("/admin");
});

app.get("/admin", async (req, res) => {
  const content = await fs.readFile("database.json", "utf-8");
  res.render("admin", { db: JSON.parse(content) });
});

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(8000, () => {
  console.log("server started");
});
