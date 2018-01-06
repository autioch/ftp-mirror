<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <title>Records list</title>
  <script type="text/javascript">
    if (self != top) {
      top.location = self.location;
    }
  </script>
  <style>
  html {font: 16px Verdana;background:#333}
  iframe {min-width:640px;min-height:480px;border:solid 1px #888;margin-left:6px}
  table, th,td, tr {border-collapse:collapse;border: solid 1px #888;padding: 3px;}
  body {display:flex;width:100%}
  a {color:#09f;text-decoration:none}
  table {table-layout:fixed}
  </style>
</head>

<body>
  <table>
    <tr>
      <th>Link</th>
      <th>Year</th>
      <th>Month</th>
      <th>Day</th>
      <th>Hour</th>
      <th>Minute</th>
      <th>Second</th>
      <th>Duration</th>
    </tr>
  </table>
  <iframe></iframe>
  <script type="text/javascript">
    const container = document.querySelector('table');
    const player = document.querySelector('iframe');

    [
      <?php
      if ($dh = opendir('.')){
        while (($file = readdir($dh)) !== false){
          echo "'", $file , "',\n";
        }
        closedir($dh);
      }
      ?>
    ]
    .filter(file => file.includes('motion'))
    .map((file, index) => {
      const cells = [];
      const [,date, time, duration] = file.split(' ').map(part => part.trim()).filter(part => part.length);

      cells.push(...date.replace(',', '').split('.').reverse());
      cells.push(...time.split('-'));
      cells.push(parseInt(duration, 10) + 's');

      const tr = document.createElement('tr');

      const link = document.createElement('a');
      link.href = file;
      link.textContent = index;

      link.onclick = (ev) =>{ player.src= file;ev.preventDefault();};

      const el = document.createElement('td');
      el.appendChild(link);
      tr.appendChild(el);

      cells.map(cell => {
      const el = document.createElement('td');
      el.textContent = cell;
        return el;
      }).forEach(cell => tr.appendChild(cell));

      return tr;
    })
    .forEach(file => container.appendChild(file));
  </script>
</body>

</html>
