import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import time
from sklearn import preprocessing
from collections import deque
import random
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, LSTM, CuDNNLSTM, BatchNormalization, Flatten, Bidirectional #normalises data between layers
from tensorflow.keras import layers
from sklearn.model_selection import train_test_split

import tensorflow.python.util.deprecation as deprecation
deprecation._PRINT_DEPRECATION_WARNINGS = False

from tensorflow.python.framework import ops
from tensorflow.python.ops import math_ops
from tensorflow.python.keras import backend as K


def max_abs_err(y_true, y_pred):

    #runs out of gpu memory on larger bacth sizes

    y_pred = ops.convert_to_tensor(y_pred)
    y_true = math_ops.cast(y_true, y_pred.dtype)

    err = y_pred - y_true
    abs_err = math_ops.abs(err)

    return K.max(abs_err, axis=-1)

def total_abs_err(y_true, y_pred):

    #runs out of gpu memory on larger bacth sizes

    y_pred = ops.convert_to_tensor(y_pred)
    y_true = math_ops.cast(y_true, y_pred.dtype)

    err = y_pred - y_true
    abs_err = math_ops.abs(err)

    return K.sum(abs_err, axis=-1)

def total_err_squared(y_true, y_pred):
    y_pred = ops.convert_to_tensor(y_pred)
    y_true = math_ops.cast(y_true, y_pred.dtype)

    err = y_pred - y_true
    err_squared = K.square(err)

    return K.sum(err_squared, axis=-1)

def mean_weighted_abs_err(y_true, y_pred):
    #assign descending weights to the values
    #giving more impportance to the closest values
    
    y_pred = ops.convert_to_tensor(y_pred)
    y_true = math_ops.cast(y_true, y_pred.dtype)

    err = y_pred - y_true
    abs_err = math_ops.abs(err)
    temp_err = 0

    for i in range(0, 10):
        val = abs_err[0][i]
        temp_err = temp_err + val * (11 - i) / (i + 1)

    abs_err = abs_err + temp_err

    return K.mean(abs_err, axis=-1)



#in frames
SEQ_LEN = 300
EPOCHS = 100#300#100
LEARNING_RATE = 0.001
BATCH_SIZE = 32
LOSS =  tf.keras.losses.mse#mean_weighted_abs_err#tf.keras.losses.logcosh
LOSS_NAME = "MSE"
OPT =  tf.keras.optimizers.Adam(lr=LEARNING_RATE, decay=1e-6)
DROP_COLS = [ 3, 6, 7]#[2, 3, 4, 5, 6, 7]
NAME = f"RacingLine-{SEQ_LEN}-EPOCH-{EPOCHS}-LR-{LEARNING_RATE}-BS-{BATCH_SIZE}-LOSS-{LOSS_NAME}"


MAX_X = 15.29
MIN_X = -225.62
MAX_Y = 77.88
MIN_Y = -275.18

def clean_df(_df):    
    #remove empty zeros rows
    df_length = len(_df.index) - 1
    empty_index = df_length

    for i in range(df_length):
        empty = True

        for j in range(6):
            empty = empty and (_df.iloc[i][j] == 0)

        if empty:
            empty_index = i
            break;

    #remove all columns except x and y
    return _df[:empty_index]

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
    out_df = out_df.drop([2, 4, 5,], axis=1)#drops all the non x and y columns

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
    
main_df = pd.read_csv("user_input_sampledata.csv", skiprows=1, header=None)
main_df = clean_df(main_df)
main_df = main_df.drop(DROP_COLS, axis=1)

main_df = sk_scale_df(main_df)

main_input, main_output = build_seq(main_df)

train_input, test_input, train_output, test_output = train_test_split(main_input, main_output, test_size = 0.1, random_state = 0)

model = Sequential()

model.add(CuDNNLSTM(128, input_shape=(train_input.shape[1:]), return_sequences=True))
model.add(Dropout(0.2))

model.add(CuDNNLSTM(128, return_sequences=True))# stateful=True
model.add(Dropout(0.2))

model.add(CuDNNLSTM(128, return_sequences=True))

model.add(Dense(2,  activation='linear'))

model.compile(loss=LOSS, 
                optimizer=OPT)


# Train model
history = model.fit(
    train_input, train_output,
    batch_size=BATCH_SIZE,
    epochs=EPOCHS,
    validation_data=(test_input, test_output)
)

# Save model
model.save("models/{}".format(NAME)+".h5")

pred = model.predict(np.array([test_input[0]]))

x_inp = []
y_inp = []

x_out = []
y_out = []

x_pred = []
y_pred = []

for i in range(len(test_input[0])):
    x_inp.append(test_input[0][i][0])
    y_inp.append(test_input[0][i][1])

for j in range(len(test_output[0])):
    x_out.append(test_output[0][j][0])
    y_out.append(test_output[0][j][1])

for k in range(len(pred[0])):
    x_pred.append(pred[0][k][0])
    y_pred.append(pred[0][k][1])


plt.scatter(x_inp, y_inp, color="red", label="input")
plt.scatter(x_out, y_out, color="blue", label="output")
plt.scatter(x_pred, y_pred, color="green", label="prediction")

plt.text(x_inp[0], y_inp[0], "inp_s")
plt.text(x_out[0], y_out[0], "out_s")
plt.text(x_pred[0], y_pred[0], "pred_s")

plt.legend()
plt.title(NAME)
plt.show()