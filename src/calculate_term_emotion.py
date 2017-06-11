import json
import re

with open('../data/segmented_NTUCourse-1-1140.json') as f:
	data = json.load(f);

term_table = {};

def check_chinese(word):
	for i in range(len(word)):
		if(word[i] > u'\u4e000' and word[i] < u'\u9fff'):
			return True;

def check_score(a):
	if(a == '噓'): return -1;
	elif(a == '推'): return 1;
	else: return 0;

def isword(term):
	if(term.isalnum() or check_chinese(term)): return True;
	else: False;

def remove_redundent(term_table, stop_word):
	for word in stop_word:
		if(word in term_table):
			del term_table[word];

	new_term_table = {};
	for key in term_table.keys():
		if(term_table[key]['total_num'] > 5):
			new_term_table[key] = term_table[key];
	return new_term_table;

stop_word = [];
with open('../data/stop_word.txt') as f:
	for line in f:
		term = line.strip();
		stop_word.append(term);

for article_obj in data['articles']:
	for mess in article_obj['messages']:
		score = check_score(mess['push_tag']);
		
		for term in mess['push_content']:

			if(term not in term_table):
				term_table[term] = {
					'total_score': 0,
					'total_num': 0,
					'avg': 0
				}
			term_table[term]['total_score'] += score;
			term_table[term]['total_num'] += 1;
			term_table[term]['avg'] = float(term_table[term]['total_score']) / term_table[term]['total_num'];

term_table = remove_redundent(term_table, stop_word);
print(len(term_table.keys()));
with open('../data/term_emotion.json', 'w') as f:
	json.dump(term_table, f, indent=4, ensure_ascii=False);