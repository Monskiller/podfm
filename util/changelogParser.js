const rel = [
    'Added',
    'Removed',
    'Changed',
    'Fixed',
    'Deprecated'
]

module.exports = exports = function (releases) {
    let fields = new Array();

    for (property in releases) {
        if (rel.includes(property)) fields.push(buildVersionLog(property, releases[property]));
    }
    return fields;
}


function buildElementList(md, sep) {
  sep = sep || '';
  if (md)
    return md.map(buildElement).join(sep);
  else
    return '';
}

function buildElement(el) {
  if (typeof el == 'string')
    return el;

  var tagName = el[0];
  el = el.slice(1)

  switch (tagName) {
    case 'para':
      return buildPara(el);
    case 'inlinecode':
      return buildAndSurroundElementList('`', el);
    case 'em':
      return buildAndSurroundElementList('*', el);
    default:
      throw new Error(`Unknown tag ${tagName}`);
  }
}

function buildPara(el) {
  return buildElementList(el) + '\n';
}

function buildAndSurroundElementList (marker, els) {
  return marker + buildElementList(els) + marker;
}

function buildVersionLog (name, release) {

  var list = release.map(entry => {
    return '• ' + buildElementList(entry).trim();
  });
  return { name: name, value: list.join('\n') }
}
