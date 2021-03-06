const Rating = require('../models/rating.js')
const Song = require('../models/song.js')

const addRating = async (req, res) => {
    try{
        const songFind = await Song.findOne({_id: req.body.songId})

        console.log('songFind', songFind);

        if(songFind != null){

            const ratingFind = await Rating.findOne({songId: songFind._id.toString(), userId: req.user._id.toString()})

            if (ratingFind != null ) {
                ratingFind.score = req.body.score
                ratingFind.save()
                return res.status(200).send("Rating successfully updated")
            } else {
                const tempRating = Rating()
                tempRating.score = req.body.score
                tempRating.songId = req.body.songId
                tempRating.userId = req.user._id.toString()

                // Save to database
                tempRating.save()

                console.log('rating added');

                // Return response
                return res.status(200).send("Rating successfully added")
            }
        } else {
            res.send("Song does not exist")
        }
        
    } catch (err) {
        console.log(err)
        return res.status(400).json({'message': err})
    }
}

const getAllRatingBySong = async (req, res) => {
    try {
        const ratings = await Rating.find({songId: req.body.songId})
        res.status(200).send(ratings)
    } catch (err) {
        console.log(err)
        return res.status(400).json({'message': err})
    }
}

const getAvgRatingBySong = async (req, res) => {

    try {
        const ratings = await Rating.find({songId: req.query.songId})
        let totalRating = 0;

        for (let i = 0; i < ratings.length; i++) {
            totalRating += ratings[i].score;
        }

        let avgRating = totalRating / ratings.length;

        res.status(200).send({'avg': avgRating})
    } catch (err) {
        console.log(err)
    }
}

const getRatingBySongAndUser = async (req, res) => {
    try {
        const ratings = await Rating.findOne({songId: req.query.songId, userId: req.user.id.toString()})

        if (ratings == null) {
            return res.status(200).json({"rating": null})
        }

        return res.status(200).send(ratings);
    } catch (err) {
        console.log(err)
        return res.status(400).json({'message': err})
    }
}

const deleteRating = async (req, res) => {
    try{
        const ratings = await Rating.findOne({_id: req.body.ratingId});
        if(ratings.userId == req.user._id.toString()){
            await Rating.findByIdAndDelete({_id: req.body.ratingId})
            return res.status(200).send("Rating successfully deleted")
        } else {
            return res.status(200).send("User does not have permission to remove rating")
        }
    } catch (err) {
        console.log(err)
        return res.status(400).json({'message': err})
    }
}

// TEMP CODE BELOW MIGHT DELETE LATER
const getRating = async (req, res) => {
    try{
        const ratings = await Rating.findOne({_id: req.body.ratingId});
        
        res.status(200).send(ratings);
    } catch (err) {
        console.log(err)
        return res.status(400).json({'message': err})
    }
}

/*
const getAllRating = async (req, res) => {
    try{
        const ratings = await Rating.find({});
        res.status(200).send(ratings);
    } catch (err) {
        console.log(err)
        return res.status(400).json({'message': err})
    }
}

*/

module.exports = {
    addRating,
    //getAllRating,
    getAllRatingBySong,
    getRatingBySongAndUser,
    getRating,
    deleteRating,
    getAvgRatingBySong
}