import importlib.util,json, pathlib
base=pathlib.Path(__file__).parent
spec=importlib.util.spec_from_file_location('j',base/'python_reference'/'jeodezi.py')
j=importlib.util.module_from_spec(spec);spec.loader.exec_module(j)
rename=lambda s: 'ITRF96' if s=='ITRF96 (TUREF)' else s
systems={rename(k):v for k,v in j.SISTEMLER.items()}
edges=[]
for (a,b),h in j.DONUSUMLER.items():
    edges.append({'from':rename(a),'to':rename(b),'T':list(h.T),'D':h.D,'R':list(h.R),'Tdot':list(h.Tdot),'Ddot':h.Ddot,'Rdot':list(h.Rdot),'t0':h.t0,'source':h.kaynak, 'approx': 'ozdes' in h.kaynak})
models=[]
for (a,b,m),v in j.OTOMATIK_7_PARAMETRELER.items():
    models.append({'from':rename(a),'to':rename(b),'model':m,'params':list(v['params']),'center':list(v['center']),'convention':v['konvansiyon'],'source':v['kaynak'],'code':v['kod'],'accuracy':v.get('dogruluk',''),'note':v['not']})
config={'ellipsoids':j.ELIPSOITLER,'systems':systems,'frameTransforms':edges,'datumTransforms':models,'originalProject':'GEO532 Kivy / jeodezi.py','notes':'IERS/EVRF educational parameter catalog, confirm current source for professional use.'}
(base/'data.js').write_text('/* Generated from python_reference/jeodezi.py by make_data.py. */\nexport const DATA = '+json.dumps(config,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
print(len(edges),'ITRF/EUREF edges;',len(models),'Bursa Wolf sets; systems',len(systems))
