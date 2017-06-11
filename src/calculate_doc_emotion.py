import json

def get_score(score):
	if(score < 0): return 1 * score;
	else: return score;

with open('../data/term_emotion.json') as f:
	term_emotion = json.load(f);

with open('../data/segmented_NTUCourse-1-1140.json') as f:
	data = json.load(f);

doc_emotion = {};

f_output = open('../data/doc_emotion', 'w');

for article_obj in data['articles']:
	content = article_obj['content'];
	doc_id = article_obj['article_id'];
	doc_emotion[doc_id] = {"score": 0, 'num': 0, 'avg': 0};
	for term in content:
		if(term in term_emotion):
			doc_emotion[doc_id]['score'] += get_score(term_emotion[term]['avg']);
			doc_emotion[doc_id]['num'] += 1;

	if(doc_emotion[doc_id]['num'] > 0):
		doc_emotion[doc_id]['avg'] = float(doc_emotion[doc_id]['score']) / doc_emotion[doc_id]['num'];

	if(doc_emotion[doc_id]['avg'] > 0.65):
		print(doc_id);

	f_output.write('%s\n%lf\n' % (doc_id, doc_emotion[doc_id]['avg']));
f_output.close();

with open('../data/doc_emotion.json', 'w') as f:
	json.dump(doc_emotion, f, indent=4);