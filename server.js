var express = require("express");
var path = require("path");
var server = express();
var bodyParser = require("body-parser");
var favicon = require("serve-favicon");
var mongoose = require("mongoose");

server.use(express.static(path.join(__dirname, "static")));
server.use(favicon(path.join(__dirname, "static", "slike", "favicon.ico")));

mongoose.connect("mongodb://localhost/epos_seminarski");
var db = mongoose.connection;
mongoose.set("debug", true);

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

Album = require("./models/album");

var port = 3003;
var adresa = "127.0.0.1";

server.set("view engine", "ejs");

server.get("/", function(req, res) {
	res.redirect("/albumi");
});

server.get("/albumi", function(req, res) {
	//res.json("GET");
	Album.getAlbums(function(err, albumi) {
		if (err) {
			res.send(err.message);
		}
		//res.json(albumi);
		res.render("albumi", { naslov: "Albumi", albumi: albumi });
	});
});

server.get("/albumi/:_id/:operacija", function(req, res) {
	var id = req.params._id;
	var operacija = req.params.operacija;
	Album.getAlbum(id, function(err, album) {
		if (err) {
			res.send(err.message);
		}
		if (JSON.stringify(album).search("_id") == -1) {
			res.send("Traženi album ne postoji u bazi podataka.");
		} if (operacija == "izmena") {
			res.render("izmena_albuma", { album: album } );
		} else if (operacija == "pregled") {
			//res.json(album);
			res.render("album", { album: album } );
		}
	});
});

server.get("/albumi/:_id/:redni_broj/:operacija", function(req, res) {
	var id = req.params._id;
	var redni_broj = req.params.redni_broj;
	var operacija = req.params.operacija;
	Album.find({ "_id": id }, { pesme: { $elemMatch: { redni_broj: redni_broj } } }, function(err, pesma) {
		if (err) {
			res.send(err.message);
		}
		if (JSON.stringify(pesma).search("redni_broj") == -1) {
			res.send("Tražena pesma ne postoji u bazi podataka.");
		} if (operacija == "izmena") {
			res.render("izmena_pesme", { pesma: pesma } );
		} else if (operacija == "pregled") {
			//res.json(pesma);
			res.render("pesma", { pesma: pesma } );
		}
	}).select("-datum_izdavanja -trajanje -zanr");
});

server.get("/unos_albuma", function(req, res) {
	res.render("unos_albuma");
});

server.get("/:_id/unos_pesme", function(req, res) {
	var id = req.params._id;
	Album.getAlbum(id, function(err, album) {
		if (err) {
			res.send(err.message);
		}
		if (JSON.stringify(album).search("_id") == -1) {
			res.send("Traženi album ne postoji u bazi podataka.");
		}
		res.render("unos_pesme", { album: album } );
	});
});

server.post("/albumi", function(req, res) {
	var album = req.body;
	Album.addAlbum(album, function(err, album) {
		if (err) {
			res.send(err.message);
		}
		//res.json(album);
		res.redirect("/albumi");
	});
});

server.post("/albumi/:_id", function(req, res) {
	var id = req.params._id;
	var redni_broj = req.body.redni_broj;
	var naziv = req.body.naziv;
	var demo_link = req.body.demo_link;
	var trajanje = req.body.trajanje;
	Album.update({ _id: id }, { $push: { pesme: { redni_broj: redni_broj, naziv: naziv, demo_link: demo_link, trajanje: trajanje } } }, function(err, album) {
		if (err) {
			res.send(err.message);
		}
		//res.json(album);
		res.redirect("/albumi/" + id + "/pregled");
	});
});

server.put("/albumi/:_id", function(req, res) {
	var id = req.params._id;
	var naslov = req.body.naslov;
	var izvodjac = req.body.izvodjac;
	var datum_izdavanja = req.body.datum_izdavanja;
	var zanr = req.body.zanr;
	var trajanje = req.body.trajanje;
	var omot_link = req.body.omot_link;
	Album.update({ _id: id }, { $set: { "naslov": naslov, "izvodjac": izvodjac, "datum_izdavanja": datum_izdavanja, "zanr": zanr, "trajanje": trajanje, "omot_link": omot_link } }, function(err, album) {
		if (err) {
			res.send(err.message);
		}
		//res.json(album);
		res.send("Uspešna izmena vrednosti albuma.");
	});
});

server.put("/albumi/:_id/:redni_broj", function(req, res) {
	var id = req.params._id;
	var redni_broj = req.params.redni_broj;
	var naziv = req.body.naziv;
	var demo_link = req.body.demo_link;
	var trajanje = req.body.trajanje;
	Album.update({ _id: id, "pesme.redni_broj": redni_broj }, { $set: { "pesme.$.naziv": naziv, "pesme.$.demo_link": demo_link, "pesme.$.trajanje": trajanje } }, function(err, pesma) {
		if (err) {
			res.send(err.message);
		}
		//res.json(pesma);
		res.send("Uspešna izmena vrednosti pesme.");
	});
});

server.delete("/albumi/:_id", function(req, res) {
	var id = req.params._id;
	Album.deleteAlbum(id, function(err, album) {
		if (err) {
			res.send(err.message);
		}
		//res.json(album);
		res.send("Uspešno brisanje albuma.");
	});
});

server.delete("/albumi/:_id/:redni_broj", function(req, res) {
	var id = req.params._id;
	var redni_broj = req.params.redni_broj;
	Album.update({ _id: id }, { $pull: { pesme: { redni_broj: redni_broj } } }, function(err, album) {
		if (err) {
			res.send(err.message);
		}
		//res.json(album);
		res.send("Uspešno brisanje pesme.");
	});
});

/*server.delete("/test", function(req, res) {
	console.log("Poruka je stigla!");
	res.send("Poruka je stigla!");
	var podatak = req.body.ime;
	console.log("Zdravo " + podatak + "!");
	res.send("Zdravo " + podatak + "!");
});*/

server.listen(port, adresa, function() {
	console.log("Server podignut na adresi: " + adresa + ", broj porta: " + port + ".");
});