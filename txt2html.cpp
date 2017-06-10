#include <cstdio>
#include <cstdlib>
#include <string.h>
#include <vector>

int main(int argc, char** argv){
	FILE *fp = fopen(argv[1],"r"), *out = fopen(argv[2],"w");; 
	if(fp == NULL) printf("%s open error\n",argv[1]);
	if(out == NULL) printf("%s open error\n",argv[2]);

	char doc_id[100] = "";
	while(fscanf(fp,"%s\n",doc_id)!=EOF){
		//printf("%s\n",doc_id);
		double sweet,cool,hard;
		char temp[300] = "";
		fgets(temp, 300, fp);
		if (temp[strlen(temp)-1] == '\n') {
			temp[strlen(temp)-1] = '\0';
		}
		//printf("%s\n",temp);
		fscanf(fp,"%lf %lf %lf",&sweet,&cool,&hard);
		//<a href = "https://www.ptt.cc/bbs/NTUCourse/M.1263870936.A.127.html" class = "link" id="111"></a>
		
		printf("%s %d %d %d %s\n",doc_id,(int)(sweet*100),(int)(cool*100),(int)(hard*100),temp);
		//fprintf(out,"<a href = \"https://www.ptt.cc/bbs/NTUCourse/%s.html\" class = \"link\" >%s</a> +%d+%d+%d+%s\n",doc_id,temp,(int)(sweet*100),(int)(cool*100),(int)(hard*100),temp);
		fprintf(out,"<a href = \"https://www.ptt.cc/bbs/NTUCourse/%s.html\" class = \"link\" id=\"%d+%d+%d+%s\"></a>\n",doc_id,(int)(sweet*100),(int)(cool*100),(int)(hard*100),temp);
		//printf("<a href = \"https://www.ptt.cc/bbs/NTUCourse/%s.html\" class = \"link\" id=\"%d-%d-%d\"></a>\n",doc_id,sweet*100,cool*100,hard*100);
	}

}
