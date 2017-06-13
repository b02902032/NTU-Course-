import json

with open('../data/doc_emotion.json') as f:
	doc_emotion = json.load(f);

f_output = open('../data/new_result_hard.txt', 'w');

with open('../data/result_hard.txt') as f:
	while(True):
		doc_id = f.readline();
		if(not doc_id):
			break;
		doc_id = doc_id.strip();
		name = f.readline().strip();
		score = f.readline().strip();
		if(doc_id in doc_emotion):
			score += ' %lf' % (doc_emotion[doc_id]['avg']);
		else:
			print(doc_id);
		f_output.write('%s\n%s\n%s\n' % (doc_id, name, score));


