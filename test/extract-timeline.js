import test from 'ava';
import { getTimeTable } from '../index';

test('timetableExtractor() - Extracts time/place correctly', async t => {
  const PAGE_URL = 'http://localhost:8000/termin_available.htm';
  const result = await getTimeTable(PAGE_URL);

  t.is(result.length, 8);
  t.same(result[3], {
    time: '14:00',
    title: 'Bürgeramt Karow / Buch, Pankow',
    address: 'Franz-Schmidt-Str. 8 - 10, 13125 Berlin',
    url: 'https://service.berlin.de/terminvereinbarung/termin/eintragen.php?buergerID=&buergername=&OID=82981&OIDListe=89470,89449,89485,91159,91162,91165,91177,91180,91189,62125,89644,64057,89668,97910,97925,89557,89560,89542,89545,89581,89584,89872,89917,89941,98219,98222,98225,98228,98231,87979,98261,98264,89380,97718,97724,89365,98132,89350,90982,82981,89647,89746,90001,98447,98735,92779,89008,98768,89017,98477,89026,89605,98540,89620,99164,98963,98585,98912,98873,98876,98759,98762,87259,87298,87268,88192,88195,87205,87322,87208,88603,88606&datum=2016-05-17&zeit=14:00:00&behoerde=&slots=&anliegen%5B%5D=120686&dienstleister%5B%5D=327316&dienstleister%5B%5D=327312&dienstleister%5B%5D=327314&dienstleister%5B%5D=327346&dienstleister%5B%5D=122238&dienstleister%5B%5D=327348&dienstleister%5B%5D=122252&dienstleister%5B%5D=327338&dienstleister%5B%5D=122260&dienstleister%5B%5D=327340&dienstleister%5B%5D=122262&dienstleister%5B%5D=122254&dienstleister%5B%5D=327278&dienstleister%5B%5D=327274&dienstleister%5B%5D=327276&dienstleister%5B%5D=327294&dienstleister%5B%5D=327290&dienstleister%5B%5D=327292&dienstleister%5B%5D=122291&dienstleister%5B%5D=327270&dienstleister%5B%5D=122285&dienstleister%5B%5D=327266&dienstleister%5B%5D=122286&dienstleister%5B%5D=327264&dienstleister%5B%5D=122296&dienstleister%5B%5D=327268&dienstleister%5B%5D=150230&dienstleister%5B%5D=327282&dienstleister%5B%5D=327286&dienstleister%5B%5D=327284&dienstleister%5B%5D=122312&dienstleister%5B%5D=122314&dienstleister%5B%5D=122304&dienstleister%5B%5D=327330&dienstleister%5B%5D=122311&dienstleister%5B%5D=327334&dienstleister%5B%5D=122309&dienstleister%5B%5D=327332&dienstleister%5B%5D=317869&dienstleister%5B%5D=324433&dienstleister%5B%5D=325341&dienstleister%5B%5D=324434&dienstleister%5B%5D=327352&dienstleister%5B%5D=324414&dienstleister%5B%5D=122283&dienstleister%5B%5D=327354&dienstleister%5B%5D=122276&dienstleister%5B%5D=327324&dienstleister%5B%5D=122274&dienstleister%5B%5D=327326&dienstleister%5B%5D=122267&dienstleister%5B%5D=327328&dienstleister%5B%5D=327318&dienstleister%5B%5D=327320&dienstleister%5B%5D=327322&dienstleister%5B%5D=122208&dienstleister%5B%5D=327298&dienstleister%5B%5D=122226&dienstleister%5B%5D=327300&herkunft=http://service.berlin.de/dienstleistung/120686/'
  });
});
