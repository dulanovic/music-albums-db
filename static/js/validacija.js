function validacija() {
	var brojPolja = document.getElementsByTagName("input").length;
	for (var i = 0; i < brojPolja; i++) {
		if (document.getElementsByTagName("input")[i].value == "") {
			alert("Nije dozvoljeno ostaviti prazno polje u formi, molimo ispravite unos.");
			return false;
		}
	}
	return true;
}