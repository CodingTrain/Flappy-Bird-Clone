import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from sklearn import preprocessing
from collections import deque
import random
from sklearn.model_selection import train_test_split


#in frames
SEQ_LEN = 100
EPOCHS = 100#300#100
LEARNING_RATE = 0.001
BATCH_SIZE = 32
#LOSS =  tf.keras.losses.mse#mean_weighted_abs_err#tf.keras.losses.logcosh
LOSS_NAME = "MSE"
#OPT =  tf.keras.optimizers.Adam(lr=LEARNING_RATE, decay=1e-6)
NAME = f"RacingLine-{SEQ_LEN}-EPOCH-{EPOCHS}-LR-{LEARNING_RATE}-BS-{BATCH_SIZE}-LOSS-{LOSS_NAME}"


MAX_X = 15.29
MIN_X = -225.62
MAX_Y = 77.88
MIN_Y = -275.18

def sk_scale_df(_df):
    for col in _df.columns:
        _df[col] = preprocessing.scale(_df[col].values)#scales values between 0 and 1

    _df.dropna(inplace=True)

    return _df

def min_max_scaling(_df):
    #x1 = (x - min_x) / (max_x - min_x)
    for col in _df.columns:
        max_val = max(_df[col])
        min_val = min(_df[col])

        _df[col] = (_df[col] - min_val) / (max_val - min_val)

    _df.dropna(inplace=True)

    return _df

def build_seq(_df):
    #shape:
    #input
    #(legth data set, SEQ_LEN, 5)
    #output
    #(length df, SEQ_LEN, 2)

    out_df = _df.copy()

    out_df = out_df.drop(["birdVelocity", "pipeY"], axis=1)#drops all the non x and y columns

    sequential_data = []
    for i in range(len(_df.values) - (SEQ_LEN + SEQ_LEN)):

        prev_end = i+SEQ_LEN;

        _inp = _df.values[i:prev_end]
        _out = out_df.values[prev_end:prev_end+SEQ_LEN]
        
        sequential_data.append([np.array(_inp), np.array(_out)])

    random.shuffle(sequential_data)

    X = []
    y = []

    for seq, target in sequential_data:
        X.append(seq)
        y.append(target)

    return np.array(X), np.array(y)    
    
main_df = pd.read_csv("flappyBird.csv")
#main_df = sk_scale_df(main_df)

x_vals = np.linspace(start=0, stop=len(main_df), num=len(main_df))

#y vals are inverted as p5 has the origin in the top left corner

main_input, main_output = build_seq(main_df)

train_input, test_input, train_output, test_output = train_test_split(main_input, main_output, test_size = 0.1, random_state = 0)

x_in_seq_vals = np.linspace(start=0, stop=SEQ_LEN, num=SEQ_LEN)
x_out_seq_vals = np.linspace(start=SEQ_LEN, stop=2*SEQ_LEN, num=SEQ_LEN)

y_inp = []
y_out = []

for i in range(SEQ_LEN):
    y_inp.append(test_input[0][i][0])
    y_out.append(test_output[0][i][0])

print(test_output[0])

plt.scatter(x_in_seq_vals, y_inp, color="red", label="input")
plt.scatter(x_out_seq_vals, y_out, color="blue", label="output")

#plt.scatter(x_vals, main_df["birdY"], color="green")
#plt.scatter(x_vals, main_df["pipeY"], color="black")

plt.show()