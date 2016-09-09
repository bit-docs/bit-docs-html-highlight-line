exports.highlight = {
    add: function(line, curData) {
        var lines = line.replace("@highlight","").trim();
        var html = "<span line-highlight='"+lines+"'></span>";
        var validCurData =  (curData && curData.length !== 2);
        var useCurData = validCurData && (typeof curData.description === "string") && !curData.body;

        if(useCurData) {
            curData.description += html;
        } else {
            this.body += html;
        }
    }
};
