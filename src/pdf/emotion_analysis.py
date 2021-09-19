import text2emotion as te
import pandas as pd
from pprint import pprint
import matplotlib.pyplot as plt
import numpy as np
import re

PAGE_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

#Helper Functions

#Splits text into segments
def create_segments(text, char_len=200):
    n = len(text)
    num_segs = n//char_len

    # Make as many segments as possible of size char_len
    segs = [text[x*char_len:x*char_len+char_len] for x in range(num_segs)]

    if (n % char_len) != 0:
        #Take remaining text and make into a segment
        segs.append(text[(num_segs-1)*char_len:])

    return segs

# Finds the average of every n elements
def average_segments(arr, num_segs=3):
    ret = np.array(arr)
    ret = np.nanmean(np.pad(ret.astype(float), (0, (3 - ret.size % 3) % 3), mode='constant', constant_values=np.NaN)
                    .reshape(-1, 3), axis=1)
    ret = np.repeat(ret, num_segs)
    return ret


class EmotionAnalysis():

    def __init__(self, all_pages):

        # START: Temporary code for text processing for text files
        # f = open("history.txt", "r")
        # text = f.read()
        # text = text.replace("\n", " ")
        # text = text.replace("\t", " ")
        # f.close()

        # all_pages = [text[(x-1)*3000:(x-1)*3000+3000] for x in PAGE_NUMBERS]
        # END
        all_pages.insert(0, "")
        print(f"PAGE COUNT: {len(all_pages)-1}")

        self.all_pages = all_pages
        self.calculated = ['' for _ in range(len(all_pages)+1)]
        self.d = {
            'happy':[0.0 for _ in range(len(all_pages)+1)],
            'angry':[0.0 for _ in range(len(all_pages)+1)],
            'surprise':[0.0 for _ in range(len(all_pages)+1)],
            'sad':[0.0 for _ in range(len(all_pages)+1)],
            'fear':[0.0 for _ in range(len(all_pages)+1)],
        }
        self.songs = []    

    def process_pages(self, p_nums): #Takes in page numbers to avoid recalculating the same page
        # Takes pages from saved text
        p_nums = [x for x in p_nums if x < len(self.all_pages)] 
        pages = [self.all_pages[i] for i in p_nums]
        # pprint(pages)

        # Initialize variables
        segment_pages = []
        happy = [[] for _ in range(len(pages))]
        angry = [[] for _ in range(len(pages))]
        surprise = [[] for _ in range(len(pages))]
        sad = [[] for _ in range(len(pages))]
        fear = [[] for _ in range(len(pages))]

        # Assuming format of pages will be an array of strings
        for p in pages:
            #Smaller Segments
            # segment_pages.append(create_segments(p, 200))

            #Per Page
            # segment_pages.append([p])

            #By Sentence
            print(re.split('[.!?]', p))
            segment_pages.append(re.split('[.!?]', p))
            

        n = len(segment_pages)

        # An 2D of strings, where the first dimension is pages, second dimension is the segmented text
        # pprint(segment_pages)

        for i, segments in enumerate(segment_pages):
            pn = p_nums[i]
            print(f"Processing Page {pn} or {i+1}/{n} of pages being processed")
            
            if len(self.calculated[p_nums[i]]) > 0:
                print("SENTIMENT DATA ALREADY EXISTS, SENTIMENT ANALYSIS SKIPPED")
                continue

            k = len(segments)
            for j, segment in enumerate(segments):
                print(f"Sentiment Analysis on Segment {j+1}/{k} of Page {pn}")
                res = te.get_emotion(segment)

                print("Appending")
                happy[i].append(res['Happy'])
                angry[i].append(res['Angry'])
                surprise[i].append(res['Surprise'])
                sad[i].append(res['Sad'])
                fear[i].append(res['Fear'])

        # Adding in the values for each page number
        for i, pn in enumerate(p_nums):
            # Skip existing values
            if len(self.calculated[p_nums[i]]) > 0:
                continue

            # For matplotlib charts
            self.d['happy'][pn] = 1.2*np.average(happy[i])
            self.d['angry'][pn] = 1.2*np.average(angry[i])
            self.d['surprise'][pn] = 0.8*np.average(surprise[i])
            self.d['sad'][pn] = np.average(sad[i])
            self.d['fear'][pn] = 0.5*np.average(fear[i])

            scores = np.array([self.d['happy'][pn], self.d['angry'][pn], self.d['surprise'][pn], self.d['sad'][pn], self.d['fear'][pn]])

            print(scores)
           

            # Values will be returned as a string consisting of a combination of characters corresponding to emotion
            # 0 Happy, 1 Angry, 2 Surprise, 3 Sad, 4 Fear 
            emotion_chars = ['0', '1', '2', '3', '4'] 
            top_emotion = emotion_chars[scores.argmax()]
            print(top_emotion)

            self.calculated[pn] = top_emotion

        
    def plot(self):
        df = pd.DataFrame()
        pprint(self.d.items())
        for k, v in self.d.items():
            df[k] = pd.Series(v)

        df.plot(figsize = (16,8))
        plt.show()

    def print_emotions(self, a, b):
        print(self.calculated[a:b+1])

    def jsonify(self, a, b):
        return self.calculated[a:b+1]

    def set_all_pages(self, all_pages):
        all_pages.insert(0, "")
        self.all_pages = all_pages
        self.calculated = ['' for _ in range(len(all_pages)+1)]
        self.d = {
            'happy':[0.0 for _ in range(len(all_pages)+1)],
            'angry':[0.0 for _ in range(len(all_pages)+1)],
            'surprise':[0.0 for _ in range(len(all_pages)+1)],
            'sad':[0.0 for _ in range(len(all_pages)+1)],
            'fear':[0.0 for _ in range(len(all_pages)+1)],
        }

if __name__ == "__main__":
    # Testing Caching
    ea = EmotionAnalysis([])
    ea.process_pages([1, 2, 3, 4, 5, 6, 7])
    ea.process_pages([2, 4, 5, 6, 7, 8, 9, 10, 11, 12])

    ea.print_emotions(0, 13)
    ea.plot()
    

