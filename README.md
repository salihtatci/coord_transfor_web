# GEO532 — Jeodezik Dönüşüm Laboratuvarı

Türkiye odaklı 3B koordinat dönüşümleri için tasarlanmış, **GitHub Pages üzerinde çalışan, statik ve sunucusuz** bir eğitim ve araştırma sitesi. Python/Kivy GEO532 projesindeki dönüşüm modelleri JavaScript'e taşınmıştır. Formlara girilen koordinatlar tarayıcı içinde hesaplanır; sunucuya iletilmez.

## Canlıya alma — 5 dakikada GitHub Pages

1. GitHub'da **New repository** oluşturun. Önerilen ad: `geo532-web` (public).
2. Bu ZIP paketinin **içindeki** `index.html`, `styles.css`, `app.js`, `engine.js`, `data.js`, `assets/` gibi dosyaları repository'nin **kök dizinine** yükleyin. ZIP'in kendisini yüklemeyin. **Commit changes** yapın.
3. Repository'de **Settings → Pages** sayfasını açın.
4. **Build and deployment → Source: Deploy from a branch → Branch: main → Folder: /(root) → Save** seçin.
5. GitHub Pages yayınını oluşturunca, aynı sayfada **Visit site** bağlantısı çıkar. Genel bağlantı biçimi: `https://KULLANICI.github.io/geo532-web/`.

Bir derleme sistemi (`npm install`, React, Node sunucusu) gerekmiyor. Daha sonra `main` dalına yaptığınız değişiklikler web sitesinde otomatik yayımlanabilir.

> GitHub Pages Python kodunu sunucuda çalıştırmaz. Bu nedenle `engine.js`, orijinal Python algoritmalarını tarayıcıda uygulamak üzere yeniden yazılmıştır.

## İçerik

| Dosya | Açıklama |
| --- | --- |
| `index.html` | Mobil uyumlu web sayfası, hesaplama formu, akademik açıklamalar |
| `styles.css` | Tasarım ve responsive mobil stil |
| `app.js` | Formlar, otomatik parametre seçimi, çıktı ve JSON dışa aktarma |
| `engine.js` | Jeodezik hesaplama motoru ve ileri/ters dönüşümler |
| `data.js` | Güncel Python kataloğundan üretilmiş 15 IERS/EUREF bağıntısı ve 2 EPSG/Bursa-Wolf seti |
| `make_data.py` | Kaynak `python_reference/jeodezi.py` üzerinden `data.js` yeniden üretimi |
| `python_reference/` | Kivy uygulamasının kaynak matematik dosyaları, karşılaştırma için |
| `tests/run.mjs` | JS matematik kontrol testleri |
| `.nojekyll` | GitHub Pages'e dosyaları doğrudan yayımlamasını söyler |

## Yerelde önizleme

**Windows:** Python yüklüyse klasörü terminalde açın:

```powershell
python -m http.server 8000
```

Tarayıcıda `http://localhost:8000` adresini ziyaret edin. `index.html`'e çift tıklamak bazı tarayıcılarda ES module güvenlik politikaları yüzünden çalışmayabilir. Site GitHub Pages'e yayınlandığında normal çalışır.

**Testler:** Node.js kuruluysa:

```bash
node tests/run.mjs
```

## Dönüşüm yöntemleri ve sınırlar

- Coğrafi ↔ Kartezyen: WGS84, GRS80, Hayford, WGS72, Krassovsky, Bessel elipsoitleri için çift yönlü; ters çözüm iteratif.
- Bursa-Wolf (küçük dönüklük): EPSG GN 7-2 WGS72 → WGS84 öğretici test ve **EPSG:1784 Türkiye ED50 → WGS84 (ensemble) yaklaşık 2 m** dönüşümü otomatik.
- Molodensky-Badekas: otomatik olarak kayıtlı parametre yok. Kaynak/hedef için kullanıcı doğrulanmış 7 parametre ve dönüklük merkezi girerse hesaplanır.
- IERS 14-parametre: mevcut Python projesindeki 15 ITRF/EUREF bağlantısı ile yerleşik çok-adımlı dönüşüm zinciri; parametre hızları seçili epoğa göre uygulanır. Ters adım için küçük açılı dönüşüm matrisinin doğrudan tersi alınır.
- 7-parametre (hızsız karşılaştırma): her zincir adımı kendi **t0** referans epoğunda alınır; bir gerçek epok kaydırma veya IERS14 eşdeğeri değildir.
- ITRF96 ve TUREF **aynı seçenek değildir**. Bu sitede çerçeve olarak `ITRF96` gösterilir. 2005.0 TUREF koordinatlarına epok kaydırması için nokta hızları gereklidir; **bu işlem sitede henüz yapılmaz**.
- Bazı WGS84 gerçekleşimleri ile ITRF'ler arasındaki kenarlar kaynak Python'da olduğu gibi **yaklaşık özdeşlik** varsayımı içerir, milimetrik kesinlik iddiası yoktur.
- Kaynak/hedef/model için parametre kaydı yoksa sonuç **üretilmez**; kullanıcı manuel giriş yapabilir.

Güvenilirlik için gerçek mühendislik hesaplarında seçilen dönüşüm parametrelerinin doğruluğunu, kaynağını, geçerlilik bölgesini, epokunu ve konvansiyonunu bağımsız kaynaklarla doğrulayın.

## Referanslar

- [ITRF dönüşüm parametreleri](https://itrf.ign.fr/en/solutions/transformations)
- [EPSG:1784 — ED50 to WGS 84 (30), Türkiye](https://epsg.io/1784)
- [EPSG Guidance Note 7-2](https://epsg.org/guidance-notes.html)
- [GitHub Pages kurulum](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Otomatik parametre kataloğunu yeniden üretme

Orijinal Python dosyasını güncellediyseniz:

```bash
python make_data.py
node tests/run.mjs
```

**Not:** `python_reference/jeodezi.py` içindeki parametre değerlerini periyodik olarak resmi kaynaklarla karşılaştırın. Bu proje akademik eğitim amaçlıdır ve resmî doğruluk garantisi değildir.
