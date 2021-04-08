const express = require("express");
const router = express.Router();
const Story = require("../models/Story");
const { ensureAuth } = require("../middleware/auth");
const { route } = require(".");

// @desc show add page
// @route GET / storeis/add

router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});

// @desc processing the add FORM
// @route POST /  stpores

router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.render("error/500");
  }
});

// getting all stories

router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean(); // to pas sto temo;

    res.render("stories/index", {
      stories: stories,
    });
  } catch (err) {
    console.log(err);
    res.render("error/505");
  }
});

// @desc sohw edit page
// @router get /storeid/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
  const story = await Story.findOne({ _id: req.params.id }).lean();

  if (!story) {
    // doesn't exist
    return res.redner("error/404");
  }
  if (story.user != req.user.id) {
    // another user's access
    res.redirect("/stories");
  } else {
    res.render("stories/edit", { story: story });
  }
});

// @desc update story
// @route put /stories/:id
router.put("/:id", ensureAuth, async (req, res) => {
  let story = await Story.findById({ _id: req.params.id }).lean();
  if (!story) {
    return res.render("error/404");
  }

  if (story.user != req.user.id) {
    res.redirect("/stories");
  } else {
    story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });

    res.redirect("/dashboard");
  }
});
// @desc delete story
// @route DELELTE /stories/:id
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    await Story.remove({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.render("error/404");
  }
});

//@desc show gings tsory
// @route GET /stories/:id

router.get("/:id", ensureAuth, async (req, res) => {
    try {
    const story = await Story.findById({_id: req.params.id})
    .populate('user')
    .lean()
        
    if(!story){
        return res.render('error/404')
    }

    res.render('stories/show', {
        story: story
    })
    } catch (err) {
      console.log(err);
      res.render("error/404");
    }
  });

// @desc show user stories
// @route GET /stories/user/:userId

router.get('/user/:userId', ensureAuth, async (req,res)=>{
    try {
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .lean()

        res.render('stories/index', {
            stories: stories
        })

    } catch (error) {
        console.log(err)

    }
})
module.exports = router;
