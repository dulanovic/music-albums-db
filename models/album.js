var mongoose = require("mongoose");

var albumSchema = mongoose.Schema({
	naslov: { type: String, required: true },
	omot_link: { type: String, required: true },
	izvodjac: { type: String, required: true },
	datum_izdavanja: { type: String, required: true },
	zanr: { type: String, required: true },
	trajanje: { type: String, required: true },
	pesme: [{
		redni_broj: { type: String, required: true },
		naziv: { type: String, required: true },
		demo_link: { type: String, required: true },
		trajanje: { type: String, required: true },
		_id: false }]},
	{ versionKey: false
});
albumSchema.set("collection", "albumi");

var Album = module.exports = mongoose.model("Album", albumSchema);

module.exports.getAlbums = function(callback) {
	Album.find(callback);
}

module.exports.getAlbum = function(id, callback) {
	Album.findById(id, callback);
}

module.exports.addAlbum = function(album, callback) {
	Album.create(album, callback);
}

module.exports.updateAlbum = function(id, album, options, callback) {
	var query = { _id: id };
	var update = {
		naslov: album.naslov,
		omot_link: album.omot_link,
		izvodjac: album.izvodjac,
		datum_izdavanja: album.datum_izdavanja,
		zanr: album.zanr,
		trajanje: album.trajanje,
		pesme: album.pesme
	};
	Album.findOneAndUpdate(query, update, options, callback);
}

module.exports.deleteAlbum = function(id, callback) {
	var query = { _id: id };
	Album.remove(query, callback);
}