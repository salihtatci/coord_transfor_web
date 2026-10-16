/* Generated from python_reference/jeodezi.py by make_data.py. */
export const DATA = {
  "ellipsoids": {
    "GRS80": [
      6378137.0,
      298.257222101
    ],
    "WGS84": [
      6378137.0,
      298.257223563
    ],
    "WGS72": [
      6378135.0,
      298.26
    ],
    "Hayford (International 1924)": [
      6378388.0,
      297.0
    ],
    "Krassovsky 1940": [
      6378245.0,
      298.3
    ],
    "Bessel 1841": [
      6377397.155,
      299.1528128
    ]
  },
  "systems": {
    "ITRF2020": "GRS80",
    "ITRF2014": "GRS80",
    "ITRF2008": "GRS80",
    "ITRF2005": "GRS80",
    "ITRF2000": "GRS80",
    "ITRF97": "GRS80",
    "ITRF96": "GRS80",
    "ETRF2000 (ETRS89)": "GRS80",
    "WGS84 (ensemble)": "WGS84",
    "WGS84 (G2296)": "WGS84",
    "WGS84 (G2139)": "WGS84",
    "WGS84 (G1762)": "WGS84",
    "WGS72": "WGS72",
    "ED50 (Hayford)": "Hayford (International 1924)"
  },
  "frameTransforms": [
    {
      "from": "ITRF2020",
      "to": "ITRF2014",
      "T": [
        -1.4,
        -0.9,
        1.4
      ],
      "D": -0.42,
      "R": [
        0.0,
        0.0,
        0.0
      ],
      "Tdot": [
        0.0,
        -0.1,
        0.2
      ],
      "Ddot": 0.0,
      "Rdot": [
        0.0,
        0.0,
        0.0
      ],
      "t0": 2015.0,
      "source": "IERS ITRF2020->ITRF2014",
      "approx": false
    },
    {
      "from": "ITRF2020",
      "to": "ITRF2008",
      "T": [
        0.2,
        1.0,
        3.3
      ],
      "D": -0.29,
      "R": [
        0.0,
        0.0,
        0.0
      ],
      "Tdot": [
        0.0,
        -0.1,
        0.1
      ],
      "Ddot": 0.03,
      "Rdot": [
        0.0,
        0.0,
        0.0
      ],
      "t0": 2015.0,
      "source": "IERS ITRF2020->ITRF2008",
      "approx": false
    },
    {
      "from": "ITRF2020",
      "to": "ITRF2005",
      "T": [
        2.7,
        0.1,
        -1.4
      ],
      "D": 0.65,
      "R": [
        0.0,
        0.0,
        0.0
      ],
      "Tdot": [
        0.3,
        -0.1,
        0.1
      ],
      "Ddot": 0.03,
      "Rdot": [
        0.0,
        0.0,
        0.0
      ],
      "t0": 2015.0,
      "source": "IERS ITRF2020->ITRF2005",
      "approx": false
    },
    {
      "from": "ITRF2020",
      "to": "ITRF2000",
      "T": [
        -0.2,
        0.8,
        -34.2
      ],
      "D": 2.25,
      "R": [
        0.0,
        0.0,
        0.0
      ],
      "Tdot": [
        0.1,
        0.0,
        -1.7
      ],
      "Ddot": 0.11,
      "Rdot": [
        0.0,
        0.0,
        0.0
      ],
      "t0": 2015.0,
      "source": "IERS ITRF2020->ITRF2000",
      "approx": false
    },
    {
      "from": "ITRF2020",
      "to": "ITRF97",
      "T": [
        6.5,
        -3.9,
        -77.9
      ],
      "D": 3.98,
      "R": [
        0.0,
        0.0,
        0.36
      ],
      "Tdot": [
        0.1,
        -0.6,
        -3.1
      ],
      "Ddot": 0.12,
      "Rdot": [
        0.0,
        0.0,
        0.02
      ],
      "t0": 2015.0,
      "source": "IERS ITRF2020->ITRF97",
      "approx": false
    },
    {
      "from": "ITRF2020",
      "to": "ITRF96",
      "T": [
        6.5,
        -3.9,
        -77.9
      ],
      "D": 3.98,
      "R": [
        0.0,
        0.0,
        0.36
      ],
      "Tdot": [
        0.1,
        -0.6,
        -3.1
      ],
      "Ddot": 0.12,
      "Rdot": [
        0.0,
        0.0,
        0.02
      ],
      "t0": 2015.0,
      "source": "IERS ITRF2020->ITRF96",
      "approx": false
    },
    {
      "from": "ITRF2014",
      "to": "ITRF2008",
      "T": [
        1.6,
        1.9,
        2.4
      ],
      "D": -0.02,
      "R": [
        0.0,
        0.0,
        0.0
      ],
      "Tdot": [
        0.0,
        0.0,
        -0.1
      ],
      "Ddot": 0.03,
      "Rdot": [
        0.0,
        0.0,
        0.0
      ],
      "t0": 2010.0,
      "source": "IERS ITRF2014->ITRF2008",
      "approx": false
    },
    {
      "from": "ITRF2014",
      "to": "ITRF2005",
      "T": [
        2.6,
        1.0,
        -2.3
      ],
      "D": 0.92,
      "R": [
        0.0,
        0.0,
        0.0
      ],
      "Tdot": [
        0.3,
        0.0,
        -0.1
      ],
      "Ddot": 0.03,
      "Rdot": [
        0.0,
        0.0,
        0.0
      ],
      "t0": 2010.0,
      "source": "IERS ITRF2014->ITRF2005",
      "approx": false
    },
    {
      "from": "ITRF2014",
      "to": "ITRF2000",
      "T": [
        0.7,
        1.2,
        -26.1
      ],
      "D": 2.12,
      "R": [
        0.0,
        0.0,
        0.0
      ],
      "Tdot": [
        0.1,
        0.1,
        -1.9
      ],
      "Ddot": 0.11,
      "Rdot": [
        0.0,
        0.0,
        0.0
      ],
      "t0": 2010.0,
      "source": "IERS ITRF2014->ITRF2000",
      "approx": false
    },
    {
      "from": "ITRF2014",
      "to": "ITRF97",
      "T": [
        7.4,
        -0.5,
        -62.8
      ],
      "D": 3.8,
      "R": [
        0.0,
        0.0,
        0.26
      ],
      "Tdot": [
        0.1,
        -0.5,
        -3.3
      ],
      "Ddot": 0.12,
      "Rdot": [
        0.0,
        0.0,
        0.02
      ],
      "t0": 2010.0,
      "source": "IERS ITRF2014->ITRF97",
      "approx": false
    },
    {
      "from": "ITRF2014",
      "to": "ITRF96",
      "T": [
        7.4,
        -0.5,
        -62.8
      ],
      "D": 3.8,
      "R": [
        0.0,
        0.0,
        0.26
      ],
      "Tdot": [
        0.1,
        -0.5,
        -3.3
      ],
      "Ddot": 0.12,
      "Rdot": [
        0.0,
        0.0,
        0.02
      ],
      "t0": 2010.0,
      "source": "IERS ITRF2014->ITRF96",
      "approx": false
    },
    {
      "from": "ITRF2014",
      "to": "ETRF2000 (ETRS89)",
      "T": [
        53.7,
        51.2,
        -55.1
      ],
      "D": 1.02,
      "R": [
        0.891,
        5.39,
        -8.712
      ],
      "Tdot": [
        0.1,
        0.1,
        -1.9
      ],
      "Ddot": 0.11,
      "Rdot": [
        0.081,
        0.49,
        -0.792
      ],
      "t0": 2010.0,
      "source": "EUREF ITRF2014->ETRF2000",
      "approx": false
    },
    {
      "from": "WGS84 (G2296)",
      "to": "ITRF2020",
      "T": [
        0.0,
        0.0,
        0.0
      ],
      "D": 0,
      "R": [
        0.0,
        0.0,
        0.0
      ],
      "Tdot": [
        0.0,
        0.0,
        0.0
      ],
      "Ddot": 0,
      "Rdot": [
        0.0,
        0.0,
        0.0
      ],
      "t0": 2024.0,
      "source": "WGS84(G2296)~ITRF2020 (ozdes)",
      "approx": true
    },
    {
      "from": "WGS84 (G2139)",
      "to": "ITRF2014",
      "T": [
        0.0,
        0.0,
        0.0
      ],
      "D": 0,
      "R": [
        0.0,
        0.0,
        0.0
      ],
      "Tdot": [
        0.0,
        0.0,
        0.0
      ],
      "Ddot": 0,
      "Rdot": [
        0.0,
        0.0,
        0.0
      ],
      "t0": 2016.0,
      "source": "WGS84(G2139)~ITRF2014 (ozdes)",
      "approx": true
    },
    {
      "from": "WGS84 (G1762)",
      "to": "ITRF2008",
      "T": [
        0.0,
        0.0,
        0.0
      ],
      "D": 0,
      "R": [
        0.0,
        0.0,
        0.0
      ],
      "Tdot": [
        0.0,
        0.0,
        0.0
      ],
      "Ddot": 0,
      "Rdot": [
        0.0,
        0.0,
        0.0
      ],
      "t0": 2005.0,
      "source": "WGS84(G1762)~ITRF2008 (ozdes)",
      "approx": true
    }
  ],
  "datumTransforms": [
    {
      "from": "WGS72",
      "to": "WGS84 (ensemble)",
      "model": "BURSA_WOLF",
      "params": [
        0.0,
        0.0,
        4.5,
        0.219,
        0.0,
        0.0,
        0.554
      ],
      "center": [
        0.0,
        0.0,
        0.0
      ],
      "convention": "PV",
      "source": "EPSG Guidance Note 7-2 test örneği",
      "code": "EPSG GN 7-2",
      "accuracy": "",
      "note": "Eğitim/test verisidir; resmi datum dönüşüm parametresi değildir."
    },
    {
      "from": "ED50 (Hayford)",
      "to": "WGS84 (ensemble)",
      "model": "BURSA_WOLF",
      "params": [
        -84.1,
        -101.8,
        -129.7,
        1.05,
        0.0,
        0.0,
        0.468
      ],
      "center": [
        0.0,
        0.0,
        0.0
      ],
      "convention": "PV",
      "source": "EPSG:1784 / EPSG-Tur",
      "code": "EPSG:1784",
      "accuracy": "2.0 m",
      "note": "Türkiye için yaklaşık dönüşüm; ETRS89 ile WGS84'ün eşdeğer kabul edilmesi varsayımına dayanır."
    }
  ],
  "originalProject": "GEO532 Kivy / jeodezi.py",
  "notes": "IERS/EVRF educational parameter catalog, confirm current source for professional use."
};
