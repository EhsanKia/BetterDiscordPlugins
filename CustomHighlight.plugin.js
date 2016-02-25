//META{"name":"CustomHighlight"}*//

/*

 ====== Installation ======
 1. Save file as CustomHighlight.js
 2. place file in %appdata%/BetterDiscord/plugins
 3. Refresh Discord (ctrl+R)
 4. Go to User Settings > BetterDiscord > Plugins
 5. Enable CustomHighlight

========== Usage ==========
1. Go to User Settings > BetterDiscord > Plugins
2. Open the settings panel for Custom Highlight plugin
3. Enter words you'd like highlighted, one per line
6. Save database
7. Any chat line containing those words will be highlighted

========= Warnings =========
- Matching is not case sensitive
- Highlights are only visual (no sound or notification)

 ======== Changelog ========
 1.0: Initial release

**/

function CustomHighlight() {}

CustomHighlight.prototype.highlight = function () {
	var lines = document.querySelectorAll('div.message-text');
	for (i = 0; i < lines.length; ++i) {
		var content = lines[i].innerText.toLowerCase();
		if (!this.containsName(content)) continue;
		var message = lines[i].parentElement.parentElement;
		message.classList.add('mentioned');
	}
};

CustomHighlight.prototype.containsName = function(line) {
	for (var i = 0; i < this.words.length; i++) {
		if (line.indexOf(this.words[i]) >= 0)
			return true;
	}
	return false;
};

CustomHighlight.prototype.onMessage = function () {
	this.highlight();
};

CustomHighlight.prototype.onSwitch = function () {
	this.highlight();
};

CustomHighlight.prototype.start = function () {
	this.loadDatabase();
	this.highlight();
};

CustomHighlight.prototype.load = function () {};
CustomHighlight.prototype.unload = function () {};
CustomHighlight.prototype.stop = function () {};

CustomHighlight.prototype.getName = function () {
    return "Custom Highlight";
};

CustomHighlight.prototype.getDescription = function () {
    return "Highlights lines containing specified words";
};

CustomHighlight.prototype.getVersion = function () {
    return "1.0";
};

CustomHighlight.prototype.getAuthor = function () {
    return "EhsanKia";
};

CustomHighlight.prototype.getSettingsPanel = function() {
	var self = this;
	var settings = $('<div class="form"></div>');
	settings.append('<h1 style="font-weight: bold">Highlight words:</h1>');
	settings.append('<div>(one per line)</div>');

	var textarea = $('<textarea rows=15 cols=40></textarea>');
	textarea.addClass('channel-textarea-inner');
	textarea.val(self.words.join('\n'));

	var saveButton = $('<button type="button" class="btn btn-primary">Save</div>')
		.click(function() {
			self.words = [];
			var content = textarea.val();
			var words = content.split('\n');

			for (var i = 0; i < words.length; i++) {
				var clean = words[i].toLowerCase().trim();
				if (clean.length > 0 && self.words.indexOf(clean) < 0)
					self.words.push(clean);
			}

			self.saveDatabase();
			var $b = $(this).text('Saved!');
			setTimeout(function() {$b.text('Save')}, 1000);
		});

	settings.append(textarea);
	settings.append("<br>");
	settings.append(saveButton);
	return settings;
};

CustomHighlight.prototype.saveDatabase = function() {
	window.localStorage["CustomHighlightDB"] = btoa(JSON.stringify(this.words));
}

CustomHighlight.prototype.loadDatabase = function() {
	if (window.localStorage.hasOwnProperty("CustomHighlightDB")) {
		var data = window.localStorage["CustomHighlightDB"];
		this.words = JSON.parse(atob(data));
	} else {
		this.words = [];
	}
}
