#!/usr/bin/python3
# -*- coding: utf-8
# encoding: utf-8

import time
from datetime import datetime
import pygame
import sys, signal
import json, random

kohtien_maara = 4

signal.signal(signal.SIGTERM, lambda sh: sys.exit(0))

def draw_task(tyyppi):
	while True:
		arpa = random.choice(task_data[tyyppi])

		if (arpa not in kohdat):
			break
	
	kohdat.append(arpa)

with open("tasks.json", "r", encoding="utf-8") as task_file:
	task_data = json.load(task_file)

kohdat = []

for i in range(0, kohtien_maara):

	draw_task('ajatus')
	draw_task('mekaanista')

print (kohdat)

kohtien_maara = len(kohdat)
nukutaan = 3600 / kohtien_maara

pygame.init()
sound = pygame.mixer.Sound('bell.ogg')
sound.set_volume(1)

for i in range(0, kohtien_maara):

	print('Tehdään toimintoa '+kohdat[i]+' '+ str(nukutaan / 60.0) + ' minuuttia, aika: '+datetime.now().strftime('%H:%M'))
	sound.play()
	time.sleep(nukutaan)

sound.play()
time.sleep(2)
sound.play()

print('mm '+str(sound.get_length()))

time.sleep(sound.get_length())
