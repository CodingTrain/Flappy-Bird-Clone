#test if current transfer training works
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from sklearn import preprocessing
from collections import deque
import random
import tensorflow as tf
from tensorflow.keras.models import Sequential, Model
from tensorflow.keras.layers import Dense, Dropout, LSTM, CuDNNLSTM, BatchNormalization, Flatten, Bidirectional, Input, RepeatVector, Conv1D, MaxPooling1D, LeakyReLU
from tensorflow.keras import layers
from sklearn.model_selection import train_test_split
from sklearn.utils import shuffle

#in frames
SEQ_LEN = 100
EPOCHS = 1#100
LEARNING_RATE = 0.0001
BATCH_SIZE = 1000
LOSS =  tf.keras.losses.mse#tf.keras.losses.logcosh
OPT =  tf.keras.optimizers.Adam(lr=LEARNING_RATE, decay=1e-10)

#Preprocessing functions
max_vals = [600, 1, 18, 500]
min_vals = [170, 0, -10, 0]

def min_max_scale(_df):
    #x1 = (x - min_x) / (max_x - min_x)
    for col, max_val, min_val in zip(_df.columns, max_vals, min_vals):
        _df[col] = (_df[col] - min_val) / (max_val - min_val)

    _df.dropna(inplace=True)

    return _df

def build_seq(_df):
    out_df = _df.copy()

    out_df = out_df.drop(["birdJump", "birdVelocity", "pipeY"], axis=1)#drops all the non x and y columns

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
  
def load_and_split_runs(train_runs, test_run):
    train_input = np.empty((0, SEQ_LEN, 4))
    train_output = np.empty((0, SEQ_LEN, 1)) 
    
    for train_run in train_runs:
      _df = pd.read_csv("./trainData/"+train_run+".csv")
      _df = min_max_scale(_df)
      _input, _output = build_seq(_df)
      
      train_input = np.concatenate((train_input, _input))
      train_output = np.concatenate((train_output, _output))

    test_df = pd.read_csv("./trainData/"+test_run+".csv")
    test_df = min_max_scale(test_df)
    test_input, test_output = build_seq(test_df)
    
    #shuffle
    train_input, train_output = shuffle(train_input, train_output)
    test_input, test_output = shuffle(test_input, test_output)   
    
    return train_input, test_input, train_output, test_output

# load and preprocess data

train_runs = ["flappyBird (2)",
             "flappyBird (3)",
             "flappyBird (4)",
             "flappyBird (5)",
             "flappyBird (6)",
             "flappyBird (7)",
             "flappyBird (8)",
             "flappyBird (9)",
             "flappyBird (10)",
             "flappyBird (11)",
             "flappyBird (12)",
             "flappyBird (13)",
             "flappyBird (14)",
             "flappyBird (15)",
             "flappyBird (16)",
             "flappyBird (17)",
             "flappyBird (18)",
             "flappyBird (19)",
             "flappyBird (20)",]

train_input, test_input, train_output, test_output = load_and_split_runs(train_runs, "flappyBird")

#Train model

def plot_prediction(test_input, test_output, pred):
  x_in_seq_vals = np.linspace(start=0, stop=SEQ_LEN, num=SEQ_LEN)
  x_out_seq_vals = np.linspace(start=SEQ_LEN, stop=2*SEQ_LEN, num=SEQ_LEN)

  y_inp = []
  y_out = []
  y_pred = []

  for i in range(SEQ_LEN):
      y_inp.append(test_input[0][i][0])
      y_out.append(test_output[0][i][0])
      y_pred.append(pred[0][i][0])

  plt.scatter(x_in_seq_vals, y_inp, color="red", label="input")
  plt.scatter(x_out_seq_vals, y_out, color="blue", label="output")
  plt.scatter(x_out_seq_vals, y_pred, color="green", label="output")

  plt.show()

def lstmModel():
    inputs = Input(shape=(train_input.shape[1:]))

    lstm_1 = LSTM(256, return_sequences=True)(inputs)
    lstm_1 = BatchNormalization()(lstm_1)
    lstm_1 = Dropout(0.5)(lstm_1)

    lstm_2 = LSTM(256, return_sequences=True)(lstm_1)
    lstm_2 = BatchNormalization()(lstm_2)
    lstm_2 = Dropout(0.5)(lstm_2)
    
    lstm_3 = LSTM(256, return_sequences=True)(lstm_2)
    lstm_3 = BatchNormalization()(lstm_3)
    lstm_3 = Dropout(0.5)(lstm_3)
   
    lstm_4 = LSTM(128, return_sequences=True)(lstm_3)

    outputs = Dense(1, activation="linear")(lstm_4)

    return Model(inputs=inputs, outputs=outputs)

def seq2seqModel():
    inputs = Input(shape=(train_input.shape[1:]))

    lstm_1 = CuDNNLSTM(256, return_sequences=True)(inputs)
    lstm_1 = CuDNNLSTM(256, return_sequences=False)(lstm_1)

    repeat_vec = RepeatVector(SEQ_LEN)(lstm_1)

    lstm_2 = CuDNNLSTM(256, return_sequences=True)(repeat_vec)
    lstm_2 = CuDNNLSTM(256, return_sequences=True)(lstm_2)
    
    dense_1 = Dense(128, activation="relu")(lstm_2)
    
    outputs = Dense(1, activation='linear')(dense_1)
    
    return Model(inputs=inputs, outputs=outputs)

model = lstmModel()

model.compile(loss=LOSS, 
                  optimizer=OPT,
                  metrics=['mse']) 

# Train model
history = model.fit(
    train_input, train_output,
    batch_size=BATCH_SIZE,
    epochs=EPOCHS,
    validation_data=(test_input, test_output)
)

pred = model.predict(np.array([test_input[0]]))

plot_prediction(test_input, test_output, pred)

model.save_weights("model_1.h5")

# summarize history for accuracy
plt.plot(history.history['mean_squared_error'])
plt.plot(history.history['val_mean_squared_error'])
plt.title('model mse')
plt.ylabel('mse')
plt.xlabel('epoch')
plt.legend(['train', 'test'], loc='upper left')
plt.show()
# summarize history for loss
plt.plot(history.history['loss'])
plt.plot(history.history['val_loss'])
plt.title('model loss')
plt.ylabel('loss')
plt.xlabel('epoch')
plt.legend(['train', 'test'], loc='upper left')
plt.show()

# Save model
model.save('./models/keras.h5')

#!pip install tensorflowjs 
#!mkdir model
#!tensorflowjs_converter --input_format keras keras.h5 model/