//Script by Aneesh of www.bloggerplugins.org
//Released on August 19th August 2009
//Modifed by www.ainisastra.com
var relatedTitles = new Array();
var relatedTitlesNum = 0;
var relatedUrls = new Array();
var thumburl = new Array();
function related_results_labels_thumbs(json) {
for (var i = 0; i < json.feed.entry.length; i++) {
var entry = json.feed.entry[i];
relatedTitles[relatedTitlesNum] = entry.title.$t;
try 
{thumburl[relatedTitlesNum]=entry.media$thumbnail.url;}


catch (error){
s=entry.content.$t;a=s.indexOf("<img");b=s.indexOf("src=\"",a);c=s.indexOf("\"",b+5);d=s.substr(b+5,c-b-5);if((a!=-1)&&(b!=-1)&&(c!=-1)&&(d!="")){
thumburl[relatedTitlesNum]=d;} else thumburl[relatedTitlesNum]='https://lh3.googleusercontent.com/-5nN713vw5Jw/UGsVkxK48zI/AAAAAAAAASc/NrbFPV9wSbg/h180/no_image.jpg';




}

if(relatedTitles[relatedTitlesNum].length>35) relatedTitles[relatedTitlesNum]=relatedTitles[relatedTitlesNum].substring(0, 35)+" ";
for (var k = 0; k < entry.link.length; k++) {
if (entry.link[k].rel == 'alternate') {
relatedUrls[relatedTitlesNum] = entry.link[k].href;
relatedTitlesNum++;


}
}
}
}
function removeRelatedDuplicates_thumbs() {
var tmp = new Array(0);
var tmp2 = new Array(0);
var tmp3 = new Array(0);
for(var i = 0; i < relatedUrls.length; i++) {
if(!contains_thumbs(tmp, relatedUrls[i])) 
{
tmp.length += 1;
tmp[tmp.length - 1] = relatedUrls[i];
tmp2.length += 1;
tmp3.length += 1;
tmp2[tmp2.length - 1] = relatedTitles[i];
tmp3[tmp3.length - 1] = thumburl[i];
}
}
relatedTitles = tmp2;
relatedUrls = tmp;
thumburl=tmp3;


}

function contains_thumbs(a, e) {
for(var j = 0; j < a.length; j++) if (a[j]==e) return true;
return false;
}
function printRelatedLabels_thumbs() {
for(var i = 0; i < relatedUrls.length; i++)
{
if((relatedUrls[i]==currentposturl)||(!(relatedTitles[i])))
{
relatedUrls.splice(i,1);
relatedTitles.splice(i,1);
thumburl.splice(i,1);
i--;

}
}


var r = Math.floor((relatedTitles.length - 1) * Math.random());
var i = 0;

if(relatedTitles.length>0)
document.write('<div style="clear: both;"></div>');
while (i < relatedTitles.length && i < 30 && i<maxresults) {


document.write('<div class="more"><div class="image" id="related-img">');
if(i!=0) document.write(' ');
else document.write(' ');
document.write('<a href="' + relatedUrls[r] + '"><img src="'+thumburl[r]+'"/></a></div><div class="titel"><h3><a href="' + relatedUrls[r] + '">'+relatedTitles[r]+'</a></h3>View Detail Product</div></div>');


if (r < relatedTitles.length - 1) {
r++;
} else {
r = 0;
}
i++;
}
relatedUrls.splice(0,relatedUrls.length);
thumburl.splice(0,thumburl.length);
relatedTitles.splice(0,relatedTitles.length);

}


