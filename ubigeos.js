  (function(w){
    'use strict';

    var Ubigeos = function(){

        this.init = function() {
            var self = this;
            self.states = {}
            self.provinces = {};
            self.districts = {};
            self.initEvents();
        }

        this.initEvents = function() {
            var self = this;
            document.getElementById('ubigeos').onchange = function(){
                var ubigeosFile = this.files[0];

                var reader = new FileReader();
                reader.onload = function(progressEvent){    
                    var rows = this.result.split('\n');
                    for(var i = 0; i < rows.length; i++){        
                        self.saveUbigeos(rows[i].replace(/[”|“]/g,""));                        
                    }

                    self.paintData("States", self.states);
                    self.paintData("Provinces", self.provinces);
                    self.paintData("Districts", self.districts);
                };
                reader.readAsText(ubigeosFile);                
            };
        }

      this.saveUbigeos = function(dataRows) {
            var self = this;
            var data = dataRows.split("/");
            var procData = null;
            var parentData = null;
            
            data.forEach(function(e, i) {
                procData = /\s*(\d*)\s*(.*)/.exec(e);
                if(Array.isArray(procData)){
                    if(!procData[0].replace(/\s/g,"").length) return;            
                    
                    switch (i){
                        case 0:
                            self.states[procData[1]] = [ procData[1], procData[2] ];
                        break;
                        case 1:
                            self.provinces[procData[1]] = self.buildParentRow(procData, parentData);
                        break;
                        case 2:
                            self.districts[procData[1]] = self.buildParentRow(procData, parentData);
                        break;

                        default : console.log("wrong Index");
                    }

                    parentData = procData;
                }
            });        
        }

        this.buildParentRow = function(cRow, pRow){
            return [ cRow[1], cRow[2], pRow[1], pRow[2] ];
        }

        this.paintData = function(title, data){
            var self = this;
            var prettyData = "";
            for(var i in data){
                prettyData += self.getPrettyRow(data[i]) + "\n";
            }            
            console.info("=======" + title + "=======");
            console.info(prettyData);
            console.info("");
        }

        this.getPrettyRow = function(row){
            var stringLenghtSize = 12;
            if(Array.isArray(row)){
                var rowLenght =  stringLenghtSize - row[1].length;
                row[1] = (row[1].length < stringLenghtSize) ? row[1] + new Array(rowLenght).join(' ') : row[1];
                return row.join(' - ');
            }
            return "";
            
        }     

        this.init();
    }

    new Ubigeos();

  })(window);