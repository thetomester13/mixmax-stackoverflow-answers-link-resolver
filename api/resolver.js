var sync = require('synchronize');
var request = require('request');
var _ = require('underscore');

// The API that returns the in-email representation.
module.exports = function(req, res) {
  var url = req.query.url.trim();

  // Stackoverflow answer
  var matches = url.match(/([0-9]+)$/);
  if (!matches) {
    res.status(400).send('Invalid URL format');
    return;
  }

  var id = matches[1];

  var response;
  try {
    response = sync.await(request({
      url: 'https://api.stackexchange.com/2.2/answers/' + encodeURIComponent(id) + '?site=stackoverflow&filter=!-*f(6t0WW)1e', // Filter from https://api.stackexchange.com/docs/answers-by-ids
      gzip: true,
      json: true,
      timeout: 15 * 1000
    }, sync.defer()));
  } catch (e) {
    res.status(500).send('Error');
    return;
  }

  var answer      = response.body.items[0]; // Get the answer object...
  var answerTitle = answer.title; // ...and all of the relevant properties we need
  var isAccepted  = answer.is_accepted;
  var checkMark   = (isAccepted) ? '<span style="color: #4FAF6A; margin-right: 4px;">&#10003;</span> ' : '';
  var answerBody  = answer.body;
  var ownerName   = answer.owner.display_name;
  var ownerImage  = encodeURI(answer.owner.profile_image);
  var emailBody   = `
<table id="" class="card-v3" cellpadding="0" cellspacing="0" style="border:1px solid #f5ffff; border-radius:4px; width:100%; max-width:578px; mso-border-alt: none;">
      <tbody><tr style="border:1px solid #d5ecff; mso-border-alt:none; display:block; border-radius: 3px;">
        <td style="display:block; padding:8px; border-radius:2px; border:1px solid #99b0e1; font-size:0; vertical-align:top; background-color:white; mso-border-alt:none; position:relative;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0" valign="top" style="border-collapse:separate; text-align:left;">
<tbody><tr class="">
  <td class="palm-one-whole" rowspan="2" valign="top" style=" width:134px;">
<table width="100%" class="inner" border="0" cellpadding="0" cellspacing="0" valign="top" style="border-collapse:separate; ">
  <tbody><tr>
    <td valign="top" style="padding: ">
      <a href="` + url + `" target="_blank" style="display:block;"><img src="https://res.cloudinary.com/mixmax/image/fetch/w_225,h_168,c_fill,q_90,fl_progressive,g_faces:center/` + ownerImage + `" class="palm-one-whole" width="120" style="display:block; width:120px; vertical-align:top;" alt="Preview image"></a>
      <script>
      var imgs = [].slice.call(document.querySelectorAll('img'));
      var lastImg = imgs[imgs.length - 1];
      lastImg.src = 'https://res.cloudinary.com/mixmax/image/fetch/w_225,h_168,c_fill,q_90,fl_progressive,g_faces:center/` + ownerImage + `';
      </script>
    </td>
  </tr>
</tbody></table>
</td>
<td class="palm-one-whole" rowspan="" valign="top" style="font-size:13px; width:px;">
<table width="100%" class="inner" border="0" cellpadding="0" cellspacing="0" valign="top" style="border-collapse:separate; font-size:13px;">
  <tbody><tr>
    <td valign="top" style="padding: ">
            <table cellpadding="0" cellspacing="0" valign="top" style="border-collapse:collapse">
      <tbody><tr>
        <td colspan="2" valign="top" style="min-width:100%; padding-bottom: 2px; font-size:16px; line-height:22px; font-weight:600; font-family: 'Avenir Next', 'Segoe UI', 'Calibri', Arial, sans-serif;">
    <a href="` + url + `" target="_blank" style="text-decoration:none;  display:block;  color:#333;  border:none;">
      ` + checkMark + answerTitle + `
    </a>
        </td>
      </tr>
        <tr>
          <td colspan="2" valign="top" style="min-width:100%;  padding-bottom: 4px;  font-size:13px; line-height:17px;  font-family:'Segoe UI', 'Helvetica Neue', Helvetica, 'Calibri', Arial, sans-serif;">
    <a href="` + url + `" target="_blank" style="text-decoration:none;  display:block;  color:#333;  border:none;">` + answerBody + `</a>
          </td>
        </tr>
    </tbody></table>
    </td>
  </tr>
</tbody></table>
</td>
  </tr><tr>
    <td valign="bottom">
      <table width="100%" border="0" cellpadding="0" cellspacing="0" valign="top" style="border-collapse:separate; ">
        <tbody><tr>
          <td valign="bottom" style="line-height:11px; font-family: 'Avenir Next', 'Segoe UI', 'Calibri', Arial, sans-serif;
" class="hostname">
            <a style="color:#aab; display:block;  font-size:11px;  margin:0;  letter-spacing:1px;  padding-left: 1px; text-decoration:none;  text-transform:uppercase;" href="` + url + `" target="_blank">- ` + ownerName + `</a>
          </td>
          <td align="right" valign="bottom">
              <a href="https://mixmax.com/r/7A5tcH4nxY6ZoNbsH" style="display:block;  vertical-align:top;  font-size:0;" target="_blank">
                <img src="https://emailapps.mixmax.com/img/badge_mixmax.png" align="top" height="20" style="display:block;" alt="Mixmax" border="0">
              </a>
          </td>
        </tr>
      </tbody></table>
    </td>
  </tr>
</tbody></table>
       </td>
      </tr>
    </tbody></table>
  `; // This large HTML chunk was copied from a Link Resolver from within Mixmax

  res.json({
    body: emailBody
  });

};